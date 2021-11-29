const express = require("express");
const router = express.Router();
const User = require("../mongoDB/userModel");//userModel file for storing users email and password
const Post = require("../mongoDB/postModel");//getting post from DB
const bcryptjs = require("bcryptjs");
const authentication = require("../middleware/jwtTokenAuth");

router.post("/signup", async (req, res) => { // handle post for signup page
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){ //if fields are empty then return 422
            return res.status(422).json({err: "Please Fill All Field Properly"});
        }
        const isUserFound = await User.findOne({email: email});//found for user emails 
        if(isUserFound){ //if user already exists the return 403
            return res.status(403).json({err: "User Already Exists"});
        }
        const user = new User({ // if user not exists then creat new user
            name: name,
            email: email,
            password: password
        });
        await user.save(); //save user to DB
        res.status(201).json({message: "Regiteration Success"});
    } catch (err) {
        console.log(err);
    }
});

router.post("/signin", async (req, res) => { //handle post for signin page
    try {
        const {email, password} = req.body; //get data from frontend
        if(!email || !password){ //if fields are empty then return 422
            return res.status(422).json({err: "Please Fill All Field Properly"});
        }
        const isUserFound = await User.findOne({email: email});//found for user emails 
        if(isUserFound){ //is user's email match then check its password
            const isMatch = await bcryptjs.compare(password, isUserFound.password);//comapre password with hashed password
            const token = await isUserFound.generateAuthToken(); //creating JWT token before login
            const {_id, name, followers, following} = isUserFound;
            if(isMatch){//if the is matched then signin
                return res.status(200).json({message: "User Signin Success", token:token, user:{_id, name, followers, following}});
            }else{//if not matched then send err
                return res.status(422).json({err: "Incorrect Data"});
            }
        }else{//is user's email not found then redirect him to signup page for signup...
            res.status(404).json({message: "Account Not Found"});
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;