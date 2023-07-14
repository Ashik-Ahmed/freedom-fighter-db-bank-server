const express = require('express')
const categoryController = require('../controllers/memberCategory.controller')
const verifyToken = require('../middleware/verifyToken')


const router = express.Router()

router.route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.addMemberCategory)

router.route('/:categoryId')
    .patch(verifyToken, categoryController.updatepriorityCriteria)
    .delete(verifyToken, categoryController.deleteMemberCategoryById)



module.exports = router;