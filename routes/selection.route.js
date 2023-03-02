const express = require('express');
const selectionController = require('../controllers/selection.controller')

const router = express.Router();


router.route('/')
    .get(selectionController.selectFreedomFighters)

router.route('/temporary-selection')
    .patch(selectionController.temporarySelected)


module.exports = router;