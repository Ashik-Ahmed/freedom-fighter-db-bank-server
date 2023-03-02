const express = require('express');
const eventController = require('../controllers/event.controller');
const authorization = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();

router.route('/')
    .get(eventController.getAllevents)
    .post(verifyToken, authorization('admin'), eventController.addEvent)


module.exports = router;