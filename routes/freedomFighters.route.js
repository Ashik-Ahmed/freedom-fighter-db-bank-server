const express = require('express');
const freedomFighterController = require('../controllers/freedomFighters.controller');
const complaintController = require('../controllers/complaint.controller')
const uploader = require('../middleware/uploader');

const router = express.Router();

// const Storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './profilePhotos/')
//     },
//     filename: function (req, file, cb) {
//         // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname.toLowerCase().replace(/\s+/g, '') + "_" + Date.now())
//     }
// })


// const upload = multer({
//     storage: Storage
// })


router.route('/profilePhotoUpload')
    .post(uploader.single('photo'), freedomFighterController.profilePhotoUpload)


router.route('/')
    // .post(uploader.single('photo'), freedomFighterController.insertFreedomFighter)
    .post(uploader.single('file'), freedomFighterController.insertFreedomFighter)
    .get(freedomFighterController.getFreedomFighters)

router.route('/:id')
    .get(freedomFighterController.getSingleFreedomFighter)
    .patch(freedomFighterController.updateFreedomFighterById)
    .delete(freedomFighterController.deleteFreedomFighterById)


router.route('/:id/comlaint')
    .get(complaintController.getAllComplaints)
    .post(complaintController.addNewComplaint)
    .patch(complaintController.updateComplaint)

module.exports = router;