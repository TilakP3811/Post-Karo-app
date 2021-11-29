import React, { createContext, useReducer, useEffect, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";
import CreatePost from "./CreatePost";
import User from "./User";
import FollowingsPosts from "./FollowingsPosts";
import "./bootstrap.css"
import { reducer, initialState } from "../reducer/useReducer";
import { BrowserRouter } from "react-router-dom";

export const userContext = createContext();


const Routing = () => {
    const navigate = useNavigate();
    const {state,dispatch} = useContext(userContext);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        dispatch({type:"USER", payload:user});
        if(user){
            navigate("/");
        }
        else if(!user){
            navigate("/signin");
            console.log(state);
        }
    }, [])
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/uploadphoto" element={<CreatePost />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/profile/:userid" element={<User />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/followingsposts" element={<FollowingsPosts />} />
        </Routes>
    )
}
const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <userContext.Provider value={{state, dispatch}}>
            <BrowserRouter>
                <Navbar />
                <Routing />
            </BrowserRouter>
        </userContext.Provider>
    )
}

export default App;