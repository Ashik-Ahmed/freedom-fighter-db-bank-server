const FreedomFighter = require('../models/FreedomFighter');


// insert a new freedom fighter 
exports.insertFreedomFighterService = async (req) => {

    // console.log(req.url)
    const freedomFighterInfo = new FreedomFighter({
        memberType: req.body?.type,
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

    console.log(freedomFighterInfo)

    // var freedomFighter = await FreedomFighter.create(freedomFighterInfo);

    // console.log(freedomFighter);
    // return freedomFighter;

}


//get all freedom fighters
exports.getFreedomFightersService = async (req) => {

    const { page, limit = 10, force } = req.query
    console.log(req.query)

    // console.log('path hit2');
    // const { page = 0, limit = 10 } = JSON.parse(req.query.data);
    // const { filters } = JSON.parse(req.query.filter)
    // console.log(req.query.data);
    // console.log(page, limit, force, search);
    // const queryObject = req.query.data;


    const queryObject = req.query;
    //exclude page limit sort from query
    const excludeFields = ['page', 'limit', 'sort'];
    excludeFields.forEach(field => delete queryObject[field])

    // console.log(queryObject);

    // const freedomFighters = await FreedomFighter.find(queryObject).skip((page - 1) * limit).limit(limit);

    // console.log(query)

    // using aggregation and pagination
    // if (force) {
    //     var freedomFighters = await FreedomFighter.aggregate([
    //         { $match: queryObject },
    //         { $project: { name: 1, force: 1, officialRank: 1, freedomFighterRank: 1, status: 1, invited: 1 } },
    //         { $skip: ((page - 1) * limit) },
    //         { $limit: limit }]);

    //     var totalFreedomFighterCount = await FreedomFighter.find(queryObject).countDocuments();
    // }
    // else {
    //     var freedomFighters = await FreedomFighter.aggregate([
    //         { $project: { name: 1, force: 1, officialRank: 1, freedomFighterRank: 1, status: 1, invited: 1 } },
    //         { $skip: ((page - 1) * limit) },
    //         { $limit: limit }]);

    //     var totalFreedomFighterCount = await FreedomFighter.find({}).countDocuments();
    // }

    // var freedomFighters = await FreedomFighter.aggregate([
    //     { $project: { name: 1, force: 1, officialRank: 1, freedomFighterRank: 1, status: 1, invited: 1 } }
    // ])

    //without pagination
    if (queryObject) {
        var freedomFighters = await FreedomFighter.aggregate([
            { $match: queryObject },
            { $project: { name: 1, force: 1, officialRank: 1, freedomFighterRank: 1, status: 1, invited: 1 } }
        ])

        var totalFreedomFighterCount = await FreedomFighter.find(queryObject).countDocuments();
    }

    else {
        var freedomFighters = await FreedomFighter.aggregate([
            { $match: queryObject },
            { $project: { name: 1, force: 1, officialRank: 1, freedomFighterRank: 1, status: 1, invited: 1 } }
        ])

        var totalFreedomFighterCount = await FreedomFighter.find({}).countDocuments();
    }

    // console.log(freedomFighters)


    // const totalFreedomFighterCount = await FreedomFighter.find(queryObject).countDocuments();

    console.log(totalFreedomFighterCount);
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