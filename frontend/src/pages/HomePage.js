import React from "react";
import { useNavigate } from "react-router-dom";

import './HomePage.css';

function HomePage() {
    const navigate = useNavigate(); // GET THE NAVIGATION FUNCTION

    // HANDLE NAVIGATION TO SIGNUP PAGE

    const handleSignUp = () => navigate("/signup");

    // HANDLE NAVIGATION TO LOGIN PAGE
    
    const handleLogIn = () => {
        navigate("/login"); // NAVIGATE TO THE LOGIN PAGE
    };

    return (
        <div>
            <div className="header">
                <img src="/Assets/logo.png" alt="Logo" />
            </div>
            <div className="contentHome">
                <h2>Welcome to CSAC CODE</h2>
                <p>A welcoming community to learn and thrive. Dive into coding challenges, explore our courses, or simply relax and chat with like-minded people.</p>
                <button className="signin btnhome" onClick={handleSignUp}>Sign Up</button>
                <p className="checking">Already have an account?</p>
                <button className="login btnhome" onClick={handleLogIn}>Log In</button>
            </div>
        </div>
    );
}



export default HomePage;
