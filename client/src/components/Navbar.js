import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "./App";
import "./Navbar.css";

const Navbar = () => {
    const { state, dispatch } = useContext(userContext);
    const user = JSON.parse(localStorage.getItem("user"));
    const logOut = () => {
        localStorage.clear();
        dispatch({type:"LOGOUT"});
    };

    const readLinks = () => {
        if (user) {
            return [
                <li className="nav-item" ><Link className="nav-link" to="/">Home</Link></li>,
                <li className="nav-item" ><Link className="nav-link" to="/followingsposts">Following</Link></li>,
                <li className="nav-item" ><Link className="nav-link" to="/uploadphoto">Postphoto</Link></li>,
                <li className="nav-item" ><Link className="nav-link" to="/profile">Profile</Link></li>,
                <li className="nav-item" ><Link className="nav-link" onClick={logOut} to="/signin">Log Out</Link></li>
            ]
        }
        else if (!user) {
            return [
                <li className="nav-item" ><Link className="nav-link" to="/signup">signup</Link></li>,
                <li className="nav-item" ><Link className="nav-link" to="/signin">signin</Link></li>
            ]
        }
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to={user?"/":"/signin"}>Post Karo</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {readLinks()}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;