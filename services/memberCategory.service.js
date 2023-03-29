const MemberCategory = require("../models/memberCategory")


exports.addMemberCategoryService = async (data) => {
    // console.log(data);

    const result = await MemberCategory.create(data);
    return result;
}