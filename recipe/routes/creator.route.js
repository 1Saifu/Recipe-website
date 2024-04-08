const express = require('express');
const creatorRouter = express.Router();
const { registerUser, loginUser } = require('../controllers/creator.controller');

creatorRouter.post('/register', registerUser);
creatorRouter.post('/login', loginUser);

module.exports = creatorRouter;