const FreedomFighter = require("../models/FreedomFighter");

exports.addNewComplaintService = async ({ id, issueData }) => {
    console.log(id, issueData);

    const result = await FreedomFighter.updateOne({ _id: id }, { $push: { complaints: issueData } })
    console.log(result);
    return result;
}