const Express = require('express');

const {
    registerUser,
    loginUser
} = require('../controllers/creator.controller');

const creatorRouter = Express.Router();

creatorRouter.post('/register', registerUser);
creatorRouter.post('/login', loginUser);

module.exports = creatorRouter;