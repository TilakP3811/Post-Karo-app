const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {secret} = require("../config/key");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers:[{
        type:String
    }],
    following:[{
        type: String
    }],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.pre("save", async function (next) {// hashing password
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () { //creat and store JWT token in database
    try {
        let token = jwt.sign({ _id: this._id }, secret);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

const User = new mongoose.model("USER", userSchema);

module.exports = User;