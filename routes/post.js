const express = require("express");
const router = express.Router();
const User = require("../mongoDB/userModel");//userModel file for storing users email and password
const Post = require("../mongoDB/postModel");//getting post from DB
const authentication = require("../middleware/jwtTokenAuth");

router.get("/getposts", authentication, async (req, res) => { //for viewing all posts
    try {
        const allPosts = await Post.find(); //find all posts
        res.send(allPosts); //then show them
    } catch (err) {
        console.log(err);
    }
});

router.get("/followersposts", authentication, async (req, res) => {
    try {    
        const allPosts = await Post.find({postedById:{$in:req.following}});
        res.send(allPosts);
    } catch (err) {
        console.log(err);
    }
});

router.get("/profileposts", authentication, async (req, res) => { //profile page 
    try {
        const myPosts = await Post.find({ "postedBy._id": req.userId }); // we are finding user's all uploaded photos from the DB
        res.send(myPosts);
    } catch (err) {
        console.log(err);
    }
});

router.post("/uploadphoto", authentication, async (req, res) => {// uplaod photo in DB
    try {
        const { title, body, photo } = req.body; //get title and body
        if (!title || !body || !photo) {//if both things are empty then send err
            return res.status(422).json({ err: "Fill All Field Properly" });
        }
        const post = new Post({//if not empty then store inside DB
            title: title,
            body: body,
            photo: photo,
            postedById: req.userId,
            postedBy: { _id: req.userId, name: req.userName }
        });
        post.save();
        res.json({ message: "Photo Uploaded" });
    } catch (err) {
        console.log(err);
    }
});

router.put("/like", authentication, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.userId }
    }, { new: true }).exec((err, result) => {
        if (err) {
            return res.status.json({ err: err });
        }
        res.json(result);
    })
});

router.put("/unlike", authentication, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.userId }
    }, { new: true }).exec((err, result) => {
        if (err) {
            return res.status.json({ err: err });
        }
        res.json(result);
    })
});

router.put("/comment", authentication, (req, res) => {
    if(!req.body.comment){
        return res.status(422).json({err:"write something"});
    }
    const comment = {
        comment: req.body.comment,
        commentBy: {
            _id: req.userId,
            name: req.userName
        }
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, { new: true }).exec((err, result) => {
        if (err) {
            return res.status.json({ err: err });
        }
        res.json(result);
    })
});

// router.delete("/deletepost/:postId", authentication, async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const findPost = await Post.findOne({ _id: postId });
//         if (!findPost) {
//             return res.status(404).json({ err: "Not Found" });
//         }
//         else if (findPost.postedBy._id.toSring() === req.userId.toString()) {
//             findPost.remove();
//         }
//         res.status(200).json({ message: "Post Deleted" });
//     } catch (err) {
//         console.log(err);
//     }
// });

module.exports = router;