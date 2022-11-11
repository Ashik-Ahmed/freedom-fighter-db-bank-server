const express = require('express');
const freedomFighterController = require('../controllers/freedomFighters.controller');
const authorization = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();


router.route('/')
    .post(verifyToken, authorization('admin'), freedomFighterController.insertFreedomFighter)
    .get(verifyToken, authorization('admin', 'user'), freedomFighterController.getFreedomFighters)

router.route('/:id')
    .patch(freedomFighterController.updateFreedomFighterById)
    .delete(freedomFighterController.deleteFreedomFighterById)


module.exports = router;