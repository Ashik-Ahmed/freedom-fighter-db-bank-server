const FreedomFighter = require('../models/FreedomFighter');


// insert a new freedom fighter 
exports.insertFreedomFighterService = async (freedomFighterInfo) => {

    var freedomFighter = await FreedomFighter.create(freedomFighterInfo);

    return freedomFighter;
}



// update a freedom fighter 
exports.updateFreedomFighterByIdService = async (freedomFighterId, data) => {
    // console.log(freedomFighterId, data)
    const result = await FreedomFighter.updateOne({ _id: freedomFighterId }, { $set: data });
    return result;
}


// delete a freedom fighter 
exports.deleteFreedomFighterByIdService = async (freedomFighterId) => {
    const result = await FreedomFighter.deleteOne({ _id: freedomFighterId });
    return result;
}