const express = require('express')
const categoryController = require('../controllers/memberCategory.controller')


const router = express.Router()

router.route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.addMemberCategory)

router.route('/:categoryId')
    .patch(categoryController.updatepriorityCriteria)
    .delete(categoryController.deleteMemberCategoryById)



module.exports = router;