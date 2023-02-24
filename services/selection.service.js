const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (data) => {

    const { memberType, total, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear } = data;

    console.log(total, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear, memberType);

    // const selectedFreedomFighters = await FreedomFighter.aggregate([
    //     // { $match: { invited: { $ne: '2021' }, country: "Bangladesh" } },
    //     { $project: { "name": 1, "invited": 1, "officialRank": 1, "professionalRank": "$officialRank.rank", "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
    //     { $sort: { [firstCriteria]: 1 } },
    //     { $limit: parseInt(total) }
    // ])

    if (excludePreviousYear == 'false') {
        console.log(memberType);
        var selectedFreedomFighters = await FreedomFighter.aggregate([
            { $match: { category: memberType } },
            { $project: { "name": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point", "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
            { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
            { $limit: parseInt(total) }
        ])
    }

    else {
        console.log(memberType + 'dd');
        var selectedFreedomFighters = await FreedomFighter.aggregate([
            { $match: { invited: { $ne: '2021' }, category: memberType } },
            { $project: { "name": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point", "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
            { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
            { $limit: parseInt(total) }
        ])
    }


    // console.log(firstCriteria, selectedFreedomFighters)

    return selectedFreedomFighters;
}