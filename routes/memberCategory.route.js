const express = require('express')
const categoryategoryController = require('../controllers/memberCategory.controller')


const router = express.Router()

router.route('/')
    .post(categoryategoryController.addMemberCategory)



module.exports = router;