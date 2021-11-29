import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState("");

    const postUrlDB = async () => {

        const res = await fetch("/uploadphoto", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title: title,
                body: body,
                photo: url
            })
        })

        const data = await res.json();

        if (data.message) {
            alert(data.message);
            navigate("/");
        }
        else if (data.err) {
            alert(data.err);
        }

    }

    useEffect(() => {
        if(url){
            postUrlDB();
        }
    }, [url])

    const handlePost = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "postkaro");

        fetch("https://api.cloudinary.com/v1_1/tilak-developer-25/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => console.log(err));
    };

    return (
        <div className="text-center">
            <h1 className="h3 mb-3 fw-normal">Upload Photo</h1>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="name@example.com"
                    autoComplete="off"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                <label>Title</label>
            </div>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="body"
                    placeholder="name@example.com"
                    autoComplete="off"
                    value={body}
                    onChange={(e) => { setBody(e.target.value) }}
                />
                <label>Body</label>
            </div>
            <div>
                <input
                    className="form-control form-control-lg"
                    id="formFileLg"
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
            <button className="w-100 btn btn-lg btn-info" onClick={handlePost}>Submit</button>
        </div>
    )
};

export default CreatePost;