import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return(
        <div>
            <h2>Homepage</h2>
             <Link to="/pages/Login"> 
                <button className="button">sign in</button> 
             </Link>
             <br />
             <br />
            <Link to="/pages/Register">
                <button className="button">Register</button>
            </Link>
        </div>
    )
}

export default Home;