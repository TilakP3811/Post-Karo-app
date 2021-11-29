import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import profileImg from "./images/empty_profile.png"
import "./Profile.css";

const Profile = () => {
    const [data, setData] = useState([]);
    const [userName, setUserName] = useState("");
    const [userFollowers, setUserFollowers] = useState("");
    const [userFollowing, setUserFollowing] = useState("");
    const { userid } = useParams();
    useEffect(() => {
        getPosts();
    }, [])

    const getPosts = async () => {
        try {
            const res = await fetch("/user/" + userid, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            });

            const result = await res.json();

            setUserName(result.user.name);
            setData(result.posts);
            setUserFollowers(result.user.followers);
            setUserFollowing(result.user.following);
        } catch (err) {
            console.log(err);
        }
    };

    const follow = () => {
        fetch("/followuser", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                const userData = data.result;
                localStorage.setItem("user", JSON.stringify({_id:userData._id, name:userData.name, followers:userData.followers, following:userData.following}));
                setUserFollowers(data.followedUser.followers);
            }).catch(err => console.log(err));

    };

    const unFollow = () => {
        fetch("/unfollowuser", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unFollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                const userData = data.result;
                localStorage.setItem("user", JSON.stringify({_id:userData._id, name:userData.name, followers:userData.followers, following:userData.following}));
                setUserFollowers(data.unFollowedUser.followers);
            }).catch(err => console.log(err));
    };

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="profile-page">
            {userName ? <><div className="profile-info">
                <div className="image-name">
                    <img className="profile-photo" src={profileImg} alt="ProfilePhoto" />
                    <div className="about-info">
                        <h2>{userName}</h2>
                        <div className="follow-info">
                            <p><span className="counts">{data.length}</span> <span className="f-names">Posts</span></p>
                            <p><span className="counts">{userFollowers.length}</span> <span className="f-names">Followers</span></p>
                            <p><span className="counts">{userFollowing.length}</span> <span className="f-names">Followings</span></p>
                        </div>
                        {
                            userFollowers.includes(user._id) ?
                                <button onClick={unFollow} className="btn btn-info">Unfollow</button> :
                                <button onClick={follow} className="btn btn-info">Follow</button>
                        }

                    </div>
                </div>
            </div>
                <div className="posts">
                    {
                        data.map(items => {
                            return (
                                <img key={items._id}
                                    className="post-photo"
                                    src={items.photo}
                                    alt={items.title} />
                            )
                        })
                    }
                </div></> : <h1>Loading....</h1>}

        </div>
    )
}

export default Profile;