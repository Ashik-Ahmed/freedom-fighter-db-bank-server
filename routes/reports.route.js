const express = require('express')
const reportsController = require('../controllers/reports.controller');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

const router = express.Router();

router.route('/')
    .get(verifyToken, authorization("admin"), reportsController.clearanceReport)



module.exports = router;