import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import "./form.css";

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const postData = async (e) => {
        e.preventDefault();

        const res = await fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name:name,
                email:email,
                password:password
            })
        });

        const data = await res.json();

        if(data.status === 403){
            alert(data.err);
            navigate("/signin");
        }
        else if(data.err){
            alert(data.err);
        }
        else if(data.message){
            alert(data.message);
            navigate("/signin");
        }
    };

    return (
        <div className="text-center">
            <h1 className="h3 mb-3 fw-normal">Sign Up</h1>
            <form>
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="name@example.com"
                        autoComplete="off"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                    <label>Full Name</label>
                </div>
                <div className="form-floating">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        autoComplete="off"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <label>Email</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="name@example.com"
                        autoComplete="off"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <label>Password</label>
                </div>
                <button className="w-100 btn btn-lg btn-info" type="submit" onClick={postData}>
                    Sign Up
                </button>
                <p className="mt-5 mb-3 text-muted">© 2021–2022</p>
            </form>
        </div>
    );
};

export default Signup;
