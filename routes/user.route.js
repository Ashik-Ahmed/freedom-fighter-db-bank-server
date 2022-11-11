const express = require('express');
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

const router = express.Router();



router.route('/')
    .post(verifyToken, authorization('admin'), userController.createUser)
    .get(verifyToken, authorization('admin'), userController.getAllUsers)

router.post('/login', userController.login);

router.get('/getLoggedInUser', verifyToken, userController.getLoggedInUser);

module.exports = router;