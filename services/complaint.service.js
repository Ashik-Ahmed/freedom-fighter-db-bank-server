const { ObjectId } = require("mongodb");
const FreedomFighter = require("../models/FreedomFighter");

exports.addNewComplaintService = async ({ id, issueData }) => {
    // console.log(id, issueData);
    const result = await FreedomFighter.updateOne(
        { _id: id },
        { $push: { complaints: issueData } }
    )
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
    const { complaintId, feedback } = data;
    // console.log(complaintId, feedback);
    const result = await FreedomFighter.updateOne(
        // { _id: memberId, complaints: { $elemMatch: { _id: complaintId } } },
        { 'complaints._id': complaintId },
        { $push: { 'complaints.$.feedbacks': feedback } }
    );
    // console.log(result);
    return result;
}