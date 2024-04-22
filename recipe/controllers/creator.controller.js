const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../utils/token');

async function registerUser(req, res) {
    const { username, email, password } = req.body;
    try { 

        console.log("Password received for registration:", password);

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);

        const newUser = await User.create({ username, email, password: hashedPassword });
        
        console.log("Generating token for new user:", email);
        const token = generateToken(newUser._id);

        res.status(201).json({ user: newUser, token });
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    try{ 
        console.log("Received login request for email:", email); 
        const user = await User.findOne({ email });
        console.log("User found in database:", user); 
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        console.log("Generating token for user:", email);
        const token = generateToken(user._id);

        res.json({ user, token });
    } catch(error) {
        console.error("Error occurred during login:", error);
    res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    loginUser
};