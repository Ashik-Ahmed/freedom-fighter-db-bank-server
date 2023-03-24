const FreedomFighter = require('../models/FreedomFighter');
const fs = require('fs');


// insert a new freedom fighter 
exports.insertFreedomFighterService = async (data) => {

    // console.log("fighterRank:", JSON.parse(req.body?.freedomFighterRank))
    // const freedomFighterInfo = new FreedomFighter({
    //     memberType: req.body?.type,
    //     name: req.body?.fullName,
    //     email: req.body?.email,
    //     mobile: req.body?.contact,
    //     photo: req.file?.filename,
    //     address: req.body?.address,
    //     country: req.body?.country,
    //     description: req.body?.description,
    //     status: req.body?.status,
    //     force: req.body?.force,
    //     officialRank: { rank: req.body?.officialRank, point: 20 },
    //     birthday: req.body?.birthday,
    //     freedomFighterRank: JSON.parse(req.body.freedomFighterRank),
    //     invited: req.body?.invited,
    //     facilitiesAvailed: req.body?.facilitiesAvailed,
    //     complaints: req.body?.complaints,
    //     successor: req.body?.successor,
    // })

    // console.log(freedomFighterInfo)

    // var freedomFighter = await FreedomFighter.create(freedomFighterInfo);

    // console.log(freedomFighter);
    // return freedomFighter;



    // const info = req.body
    // const officeRank = JSON.parse(info.officialRank);
    // info.officialRank = officeRank
    // const fighterRank = JSON.parse(info.freedomFighterRank);
    // info.freedomFighterRank = fighterRank
    // console.log(data)
    const memberInfo = new FreedomFighter(data)
    var result = await FreedomFighter.create(memberInfo);
    // console.log(result)
    return result;

}


//get all freedom fighters
exports.getFreedomFightersService = async (req) => {

    // const { page, limit = 10, force, category } = req.query
    const { page, limit = 10, category } = req.query

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
            {
                $project: {
                    name: 1, category: 1, force: 1, officialRank: 1, freedomFighterRank: 1, mobile: 1, address: 1, status: 1, invited: 1, invitationCount: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ["$primarySelection", []] },
                                as: "elem",
                                cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
                            }
                        }
                    }
                }
            }
        ])

        var totalFreedomFighterCount = await FreedomFighter.find(queryObject).countDocuments();
    }

    else {
        var freedomFighters = await FreedomFighter.aggregate([
            { $match: queryObject },
            {
                $project: {
                    name: 1, category: 1, force: 1, officialRank: 1, freedomFighterRank: 1, mobile: 1, address: 1, status: 1, invited: 1, invitationCount: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ["$primarySelection", []] },
                                as: "elem",
                                cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
                            }
                        }
                    }
                }
            }
        ])

        var totalFreedomFighterCount = await FreedomFighter.find({}).countDocuments();
    }

    // attaching profilePhoto field to the member data who has photo information in mongodb database 
    freedomFighters.map((fighter, index) => {
        if (fighter.photo) {
            const image = fs.readFileSync(`profilePhotos/${fighter?.photo}`, (err, data) => {
                if (err) {
                    res.write('Failed to load file');
                    res.end();
                }
                else {
                    res.write(data);
                    // console.log(data);
                    // fighter[0].profilePhoto = data;
                    // console.log(fighter[0].photo)
                    res.end()
                }
            })
            // console.log(image);
            fighter.profilePhoto = image;
        }
    })
    return { totalFreedomFighterCount, freedomFighters };
}


// update a freedom fighter 
exports.updateFreedomFighterByIdService = async (memberId, data) => {
    // console.log(memberId, data);
    const result = await FreedomFighter.updateOne({ _id: memberId }, { $set: data });
    return result;
}


// delete a freedom fighter 
exports.deleteFreedomFighterByIdService = async (freedomFighterId) => {
    const result = await FreedomFighter.deleteOne({ _id: freedomFighterId });
    return result;
}