const express = require('express')
const reportsController = require('../controllers/reports.controller')

const router = express.Router();

router.route('/')
    .get(reportsController.clearanceReport)



module.exports = router;