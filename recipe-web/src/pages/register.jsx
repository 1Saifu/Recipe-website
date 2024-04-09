import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    
    const handleUser = (e) => {
        setUsername(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };
    
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:8080/creator/register', {
                username,
                email,
                password
            });
            console.log('User registered:', response.data);
            navigate("/Main");
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };


    return(
        <div>
            <h2>Register</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                <h6>Enter name</h6>
            <input className="myInput"
                type="text"
                value={username}
                onChange={handleUser}
                required
            />
            <br />
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
            <button type="submit" className="log-button">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Register;