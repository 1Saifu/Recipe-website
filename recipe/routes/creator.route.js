const express = require('express');
const creatorRouter = express.Router();

const { registerUser, loginUser } = require('../controllers/creator.controller');

creatorRouter.post('/register', registerUser);
console.log("Backend route defined for /creator/register");
creatorRouter.post('/login', loginUser);

module.exports = creatorRouter;