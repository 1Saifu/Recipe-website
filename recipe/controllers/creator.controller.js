const User = require('../models/user');

async function registerUser(req, res) {
    const { email, password } = req.body;
    try{ 
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        //Here we create a user
        const newUser = await User.create({ email, password });
        res.status(201).json(newUser);
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    try{ 
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if(password !== user.password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        res.json(user);
    } catch(error) {
    res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    loginUser
};