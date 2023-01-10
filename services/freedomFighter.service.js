const FreedomFighter = require('../models/FreedomFighter');


// insert a new freedom fighter 
exports.insertFreedomFighterService = async (req) => {

    // console.log(req.url)
    const freedomFighterInfo = new FreedomFighter({
        name: req.body?.fullName,
        email: req.body?.email,
        mobile: req.body?.contact,
        photo: req.file?.filename,
        address: req.body?.address,
        country: req.body?.country,
        description: req.body?.description,
        status: req.body?.status,
        force: req.body?.force,
        officialRank: { rank: req.body?.officialRank, point: 20 },
        birthday: req.body?.birthday,
        freedomFighterRank: { rank: req.body?.freedomFighterRank, point: 15 },
        invited: req.body?.invited,
        facilitiesAvailed: req.body?.facilitiesAvailed,
        complaints: req.body?.complaints,
        successor: req.body?.successor,
    })

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

    // const freedomFighters = await FreedomFighter.find(queryObject).skip((page - 1) * limit).limit(limit);

    // using aggregation 
    const freedomFighters = await FreedomFighter.aggregate([
        { $match: queryObject },
        { $project: { name: 1, force: 1, officialRank: 1, freedomFighterRank: 1, status: 1, invited: 1 } }
    ]);


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