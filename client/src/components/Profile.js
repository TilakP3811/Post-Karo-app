import React, { useEffect,  useState } from "react";
import profileImg from "./images/empty_profile.png"
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    
    useEffect(() => {
        getPosts();
    }, [])

    const getPosts = async () => {
        try {
            const res = await fetch("/profileposts", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            });
            
            const result = await res.json();
            
            setData(result);
        } catch (err) {
            console.log(err);
        }
    };
    
    const user = JSON.parse(localStorage.getItem("user"));
    
   
    return (
        <div className="profile-page">
            <div className="profile-info">
                <div className="image-name">
                    <img className="profile-photo" src={profileImg} alt="ProfilePhoto" />
                    <div className="about-info">
                        <h2>{user ? user.name : ""}</h2>
                        <div className="follow-info">
                            <p><span className="counts">{data.length}</span> <span className="f-names">Posts</span></p>
                            <p><span className="counts">{user ? user.followers.length : ""}</span> <span className="f-names">Followers</span></p>
                            <p><span className="counts">{user ? user.following.length : ""}</span> <span className="f-names">Followings</span></p>
                        </div>
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
            </div>
        </div>
    )
}

export default Profile;