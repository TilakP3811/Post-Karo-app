const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [{
        type: String
    }],
    comments: [
        {
            comment: {
                type: String
            },
            commentBy: {
                _id: {
                    type: String
                },
                name: {
                    type: String
                }
            }
        }
    ],
    postedById: {
        type: String,
        require: true
    },
    postedBy: {
        type: Object
    }
});

const Post = new mongoose.model("POST", postSchema);

module.exports = Post;