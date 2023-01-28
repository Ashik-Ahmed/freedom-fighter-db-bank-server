const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (data) => {

    const { total, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear } = data;

    // console.log(total, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear);

    // const selectedFreedomFighters = await FreedomFighter.aggregate([
    //     { $match: { invited: { $ne: '2021' }, country: "Bangladesh" } },
    //     { $project: { "name": 1, "invited": 1, "officialRank": 1, "freedomFighterRank": 1, "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
    //     { $sort: { "invited_count": 1, "invited": 1, "feedomFighterRank.point": -1, "officialRank.point": -1 } },
    //     { $limit: parseInt(total) }
    // ])

    if (excludePreviousYear == 'false') {
        var selectedFreedomFighters = await FreedomFighter.aggregate([
            { $project: { "name": 1, "force": 1, "invited": 1, "officialRank": "$officialRank.rank", "freedomFighterRank": "$freedomFighterRank.rank", "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
            { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
            { $limit: parseInt(total) }
        ])
    }

    else {
        var selectedFreedomFighters = await FreedomFighter.aggregate([
            { $match: { invited: { $ne: '2021' } } },
            { $project: { "name": 1, "force": 1, "invited": 1, "officialRank": "$officialRank.rank", "freedomFighterRank": "$freedomFighterRank.rank", "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
            { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
            { $limit: parseInt(total) }
        ])
    }


    // console.log(selectedFreedomFighters.length)

    return selectedFreedomFighters;
}