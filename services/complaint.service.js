const { ObjectId } = require("mongodb");
const FreedomFighter = require("../models/FreedomFighter");

exports.addNewComplaintService = async ({ id, issueData }) => {
    // console.log(id, issueData);
    const result = await FreedomFighter.updateOne({ _id: id }, { $push: { complaints: issueData } })
    return result;
}

exports.getAllComplaintsService = async (memberId) => {
    // console.log(memberId);
    const result = await FreedomFighter.aggregate([
        { $match: { _id: ObjectId(memberId) } },
        { $project: { complaints: 1 } }
    ])
    return result[0].complaints;
}

exports.updateComplaintService = async (data) => {
    const { memberId, complaintId, feedback } = data;
    console.log(memberId, complaintId, feedback);

    const result = await FreedomFighter.updateOne({ _id: id }, { $elemMatch: { _id: complaintId } }, { $push: { feedback: { feedback } } });
    return result;
}