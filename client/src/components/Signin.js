import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "./App";
import "./form.css";

const Signup = () => {
    const {state, dispatch} = useContext(userContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const postData = async (e) => {
        e.preventDefault();

        const res = await fetch("/signin", {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        });

        const data = await res.json();

        if(data.message === "Account Not Found"){
            navigate("/signup");
            alert(data.message);
        }
        else if(data.err){
            alert(data.err);
        }
        else if(data.message){
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({type:"USER", payload:data.user});
            alert(data.message);
            navigate("/");
        }
    }

    return (
        <div className="text-center">
            <h1 className="h3 mb-3 fw-normal">Sign In</h1>
            <form>
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
                    Sign In
                </button>
                <p className="mt-5 mb-3 text-muted">© 2021–2022</p>
            </form>
        </div>
    );
};

export default Signup;
