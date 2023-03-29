const MemberCategory = require("../models/memberCategory")


exports.addMemberCategoryService = async (data) => {
    // console.log(data);

    const result = await MemberCategory.create(data);
    return result;
}

exports.getAllCategoriesService = async () => {
    const result = await MemberCategory.find({})
    return result;
}

exports.deleteMemberCategoryByIdService = async (categoryId) => {
    const result = await MemberCategory.deleteOne({ _id: categoryId });
    return result;
}