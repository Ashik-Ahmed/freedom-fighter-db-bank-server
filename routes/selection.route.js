const express = require('express');
const selectionController = require('../controllers/selection.controller')
const emailSend = require('../middleware/emailSend');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();


router.route('/')
    .get(selectionController.selectFreedomFighters)

router.route('/primary-selection')
    .get(selectionController.getPrimarySelectedMembers)
    .patch(verifyToken, selectionController.temporarySelected)

router.route('/verification-update')
    .patch(selectionController.verificationUpdate)

router.route('/delete-primary-selected')
    .patch(selectionController.deletePrimarySelectedMember)

router.route('/final-selection')
    .get(selectionController.getFinalSelectedMembers)

router.route('/send-invitation-mail')
    .post(selectionController.sendInvitationmail)

router.route('/test-selection')
    .get(selectionController.testSelection)



module.exports = router;