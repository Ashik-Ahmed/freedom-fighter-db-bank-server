const express = require('express')
const categoryController = require('../controllers/memberCategory.controller')
const verifyToken = require('../middleware/verifyToken')
const authorization = require('../middleware/authorization')


const router = express.Router()

router.route('/')
    .get(verifyToken, categoryController.getAllCategories)
    .post(verifyToken, categoryController.addMemberCategory)

router.route('/:categoryId')
    .patch(verifyToken, authorization("admin"), categoryController.updatepriorityCriteria)
    .delete(verifyToken, authorization("admin"), categoryController.deleteMemberCategoryById)



module.exports = router;