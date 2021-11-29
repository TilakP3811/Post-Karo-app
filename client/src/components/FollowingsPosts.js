import React, { useEffect, useState } from "react";
import "./Home.css";
import emptyProfile from "./images/empty_profile.png";
import { Link } from "react-router-dom";

const Home = () => {
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
        getPosts();
    }, [])

    const user = JSON.parse(localStorage.getItem("user"));

    const getPosts = async () => {
        try {
            const res = await fetch("/followersposts", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            });

            const result = await res.json();
            console.log(result);
            setData(result);
        } catch (err) {
            console.log(err);
        }
    }

    const likePost = (id) => {

        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(items => {
                    if (items._id === result._id) {
                        return result;
                    }
                    return items;
                });
                setData(newData);
            }).catch(err => console.log(err));
    }

    const unLikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(items => {
                    if (items._id === result._id) {
                        return result;
                    }
                    return items;
                });
                setData(newData);
            }).catch(err => console.log(err));
    }

    const commentPost = (comment, id) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                comment: comment,
                postId: id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(items => {
                if(items._id === result._id){
                    return result;
                }
                return items
            })
            setData(newData);
        })
    }

    return (
        <div className="home">
            {
                data.map(items => {
                    return (
                        <div key={items._id} className="post-div">
                            <div className="user-info">
                                <img className="profile" src={emptyProfile} alt="" />
                                <h5 className="user-name"><Link style={{color: "black"}} className="nav-link" to={items.postedBy._id !== user._id ? "/profile/" + items.postedBy._id : "/profile"}>{items.postedBy.name}</Link></h5>
                            </div>
                            <div className="post">
                                <img className="post-img" src={items.photo} alt="post" />
                            </div>
                            <div className="like-comment">
                                {
                                    items.likes.includes(user ? user._id : "") ?
                                        <i className="far fa-thumbs-down fa-lg" onClick={() => { unLikePost(items._id) }}></i> :
                                        <i className="far fa-thumbs-up fa-lg" onClick={() => { likePost(items._id) }}></i>
                                }
                                <i className="far fa-comment-dots fa-lg"></i>
                            </div>
                            <div className="title-body">
                                <p className="title">{items.likes.length} likes & {items.comments.length} comments</p>
                                <h6 className="title">{items.title}</h6>
                                <p className="body">{items.body}</p>
                                {
                                    items.comments.map(record=>{
                                        return <p key={record._id} className="body"><span style={{fontWeight:"bold"}}>{record.commentBy.name} :</span> {record.comment}</p>
                                    })
                                }
                            </div>
                            <div className="post-comments">
                                <form className="input-group" onSubmit={(e) => {
                                    e.preventDefault();
                                    commentPost(e.target[0].value, items._id);
                                    setComment("");
                                }}>
                                    <input type="text" className="form-control" placeholder="Comment" value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
                                    <button style={{ marginTop: "0px" }} className="btn btn-outline-info">Comment</button>
                                </form>
                            </div>
                        </div>
                    );
                }).reverse()
            }

        </div>
    )
}

export default Home;