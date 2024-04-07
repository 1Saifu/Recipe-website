import React from "react";
import { useState } from "react";

const Login = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleEmail = (e) => {
    setEmail(e.target.value);
};

const handlePassword = (e) => {
    setPassword(e.target.value);
}

    return(
        <div>
            <h2>Sign in</h2>
            <div className="form-container">
                <div>
            <h6>Enter email</h6>
            <input className="myInput"
                type="email"
                value={email}
                onChange={handleEmail}
                required
            />
            <br />
            <h6>Enter Password</h6>
            <input className="myInput"
                type="password"
                value={password}
                onChange={handlePassword}
                required
            />
            <br />
            <br />
            <button type="submit" className="log-button">Log in</button>
                </div>
            </div>
        </div>
    )
}

export default Login;