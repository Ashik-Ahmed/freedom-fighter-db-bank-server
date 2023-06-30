const express = require('express');
const successorController = require('../controllers/successor.controller')

const router = express.Router();


router.route('/')
    .post(successorController.createSuccessor)

router.route('/:id')
    .get(successorController.getSuccessorByFreedomFighterId)
    .delete(successorController.deleteSuccessorById)


module.exports = router;