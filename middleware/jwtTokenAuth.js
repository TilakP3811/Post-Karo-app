const jwt = require("jsonwebtoken");
const User = require("../mongoDB/userModel");
const {secret} = require("../config/key");

const authentication = async (req, res, next) => {//authentication for user signed in or not
    try {
        const {authorization} = req.headers; //get auth token from req.headers
        if(!authorization){//if its epmty then return err
            return res.status(422).json({err: "Signin First"});
        }
        const token = authorization.replace("Bearer ", "");//take token from the auth if its not empty
        const verifyToken = jwt.verify(token, secret);//verify token is right or not
        const user = await User.findOne({_id: verifyToken._id, "tokens.token":token});//check is user available on over DB eith this perticular token
        if(!user){//if not then err
            return res.status(404).json({err: "Signin First"});
        }

        //storing ueser's data inside req's object by creating various variables
        req.token = token;
        req.user = user;
        req.user.tokens = undefined;
        req.user.password = undefined;
        req.user.__v = undefined;
        req.userId = user._id;
        req.userName = user.name;
        req.following = user.following;
        req.followers = user.followers;
        next();
    } catch (err) {
        console.log(err);
        return res.status(422).json({err: "Signin First"});
    }
}

module.exports = authentication;