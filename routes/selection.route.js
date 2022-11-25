const express = require('express');
const selectionController = require('../controllers/selection.controller')

const router = express.Router();


router.route('/')
    .get(selectionController.selectFreedomFighters)


module.exports = router;