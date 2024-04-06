import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return(
        <div>
             <Link to="/login"> 
                <button className="button">sign in</button> 
             </Link>
             <br />
             <br />
            <Link to="/register">
                <button className="button">Register</button>
            </Link>
        </div>
    )
}

export default Home;