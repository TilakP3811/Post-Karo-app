const express = require("express");
const router = express.Router();
const User = require("../mongoDB/userModel");//userModel file for storing users email and password
const Post = require("../mongoDB/postModel");//getting post from DB
const bcryptjs = require("bcryptjs");
const authentication = require("../middleware/jwtTokenAuth");

router.get("/user/:id", authentication, async (req, res) => {
    try {
        const id = req.params.id;
        const findUser = await User.findOne({_id:id});
        if(findUser){
            const findPosts = await Post.find({"postedBy._id": findUser._id});
            return res.json({user:{name:findUser.name, _id:findUser._id, following:findUser.following, followers:findUser.followers},posts: findPosts});
        }
        res.json({err:"Not Found"});
    } catch (err) {
        console.log(err);
    }
});

router.put("/followuser", authentication, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push:{followers: req.userId}
    },{new:true},(err, result) => {
        if(err){
            return res.status(422).json({err: err});
        }
        const followedUser = result;
        User.findByIdAndUpdate(req.userId, {
            $push:{following: req.body.followId}
        },{new:true}).then(result => {
            res.json({result, followedUser});
        }).catch(err => {
            res.json({err : err});
        })
    })
});

router.put("/unfollowuser", authentication, (req, res) => {
    User.findByIdAndUpdate(req.body.unFollowId, {
        $pull:{followers: req.userId}
    },{new:true},(err, result) => {
        if(err){
            return res.status(422).json({err: err});
        }
        const unFollowedUser = result;
        User.findByIdAndUpdate(req.userId, {
            $pull:{following: req.body.unFollowId}
        },{new:true}).then(result => {
            res.json({unFollowedUser, result});
        }).catch(err => {
            res.json({err : err});
        })
    })
});

module.exports = router;