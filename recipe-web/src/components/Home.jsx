import React from "react";

const Home = () => {
    return(
        <div>
             <Link to="/login">
                <button>Logga in</button>
            </Link>
            <br />
            <Link to="/register">
                <button>Registrera</button>
            </Link>
        </div>
    )
}

export default Home;