const FreedomFighter = require('../models/FreedomFighter');


// insert a new freedom fighter 
exports.insertFreedomFighterService = async (freedomFighterInfo) => {

    var freedomFighter = await FreedomFighter.create(freedomFighterInfo);

    return freedomFighter;
}


//get all freedom fighters
exports.getFreedomFightersService = async (req) => {

    const { page = 1, limit = 10 } = req.query;


    const queryObject = req.query;

    //exclude page limit sort from query
    const excludeFields = ['page', 'limit', 'sort'];
    excludeFields.forEach(field => delete queryObject[field])

    const freedomFighters = await FreedomFighter.find(queryObject).skip((page - 1) * limit).limit(limit);

    const totalFreedomFighterCount = await FreedomFighter.find(queryObject).countDocuments();

    // console.log(freedomFighters);
    return { totalFreedomFighterCount, freedomFighters };
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