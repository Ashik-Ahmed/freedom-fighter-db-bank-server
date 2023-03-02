const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (data) => {

    const { memberType, total, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear } = data;

    // console.log(memberType, total, event, year, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear, memberType);

    if (excludePreviousYear == 'false') {
        var selectedFreedomFighters = await FreedomFighter.aggregate([
            { $match: { category: memberType } },
            { $project: { "name": 1, "category": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point", "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
            { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
            { $limit: parseInt(total) }
        ])
    }

    else {
        console.log(memberType + 'dd');
        var selectedFreedomFighters = await FreedomFighter.aggregate([
            { $match: { invited: { $ne: '2021' }, category: memberType } },
            { $project: { "name": 1, "category": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point", "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
            { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
            { $limit: parseInt(total) }
        ])
    }
    return selectedFreedomFighters;
}

exports.updateTemporarySelectedMembersService = async (data) => {
    const { memberIds, event, year } = data
    const result = await FreedomFighter.updateMany({ _id: { $in: memberIds } }, { $set: { primarySelection: { event: event, year: year } } }, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(`${res.nModified} documents updated`);
        console.log(res);
    });
    return result;
}

exports.getPrimarySelectedMembersService = async (data) => {
    const result = await FreedomFighter.aggregate([
        { $match: { primarySelection: data } }
    ])
    return result;
}