const Successor = require("../models/Successor");
const { updateFreedomFighterByIdService } = require("./freedomFighter.service");

//create a new user
exports.createSuccessorService = async (successorInfo) => {

    const successor = await Successor.create(successorInfo);
    // console.log(successor)
    if (successor.createdAt) {
        await updateFreedomFighterByIdService(successorInfo.freedomFighterId, { successor: successor._id })
    }
    else {
        console.log('Failed to add Successor');
    }
    return successor;
}

//get a succor by freedom fighter id 
exports.getSuccessorByFreedomFighterIdService = async (freedomFighterId) => {

    const result = await Successor.find({ freedomFighterId })
    // console.log(result);
    return result
}

//delete a successor by id 
exports.deleteSuccessorByIdService = async (freedomFighterId, successorId) => {
    const updateFreedomFighter = await updateFreedomFighterByIdService(freedomFighterId, { successor: [] })
    console.log(updateFreedomFighter);
    if (updateFreedomFighter.modifiedCount) {
        const result = await Successor.deleteOne({ _id: successorId })
        return result;
    }
}