import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import LocalStorageKit from "../utils/localStorageKit";

const Login = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleEmail = (e) => {
    setEmail(e.target.value);
};

const handlePassword = (e) => {
    setPassword(e.target.value);
}

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/creator/login`, { email, password });
        const { token, user } = response.data;
        const userId = user._id;

        const localStorageKit = new LocalStorageKit();
        localStorageKit.setTokenInStorage(token);

        console.log("Login successful:", response.data);

        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate("/Main", { state: { userId: userId } });

    } catch (error) {
        console.error("Login failed:", error.response.data.error);
    }
};


    return(
        <div>
            <h2>Sign in</h2>
            <form onSubmit={handleSubmit}>
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
            </form>
        </div>
    )
}

export default Login;