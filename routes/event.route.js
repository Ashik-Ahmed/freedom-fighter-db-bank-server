const express = require('express');
const eventController = require('../controllers/event.controller');
const authorization = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();

router.route('/')
    .get(verifyToken, eventController.getAllevents)
    .post(verifyToken, authorization('admin'), eventController.addEvent)
    .patch(verifyToken, authorization('admin'), eventController.updateEvent)

router.route('/:id')
    .delete(verifyToken, authorization('admin'), eventController.deleteEvent)


module.exports = router;