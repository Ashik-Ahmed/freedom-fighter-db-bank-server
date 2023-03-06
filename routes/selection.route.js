const express = require('express');
const selectionController = require('../controllers/selection.controller')

const router = express.Router();


router.route('/')
    .get(selectionController.selectFreedomFighters)

router.route('/primary-selection')
    .get(selectionController.getPrimarySelectedMembers)
    .patch(selectionController.temporarySelected)

router.route('/verification-update')
    .patch(selectionController.verificationUpdate)

router.route('/delete-primary-selected')
    .patch(selectionController.deletePrimarySelectedMember)



module.exports = router;