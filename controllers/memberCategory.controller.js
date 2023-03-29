const { addMemberCategoryService } = require("../services/memberCategory.service");


exports.addMemberCategory = async (req, res) => {
    try {
        const result = await addMemberCategoryService(req.body)

        console.log(result);
        if (result._id) {
            res.status(201).json({
                status: 'Success',
                data: 'Successfully inserted new Category'
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'Failed! Please try again'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}