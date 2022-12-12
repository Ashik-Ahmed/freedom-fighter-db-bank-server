const express = require('express');
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

const router = express.Router();


router.post('/login', userController.login);

router.get('/getLoggedInUser', verifyToken, userController.getLoggedInUser);

router.route('/')
    .post(verifyToken, authorization('admin'), userController.createUser)
    .get(verifyToken, authorization('admin'), userController.getAllUsers)

router.route('/:id')
    .delete(verifyToken, authorization('admin'), userController.deleteUser)


module.exports = router;