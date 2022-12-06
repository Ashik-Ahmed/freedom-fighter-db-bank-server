const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (data) => {

    const { total, firstCriteria, secondCriteria, thirdCriteria } = data;

    console.log(total, firstCriteria, secondCriteria, thirdCriteria);

    // const selectedFreedomFighters = await FreedomFighter.aggregate([
    //     { $match: { invited: { $ne: '2021' }, country: "Bangladesh" } },
    //     { $project: { "name": 1, "invited": 1, "officialRank": 1, "freedomFighterRank": 1, "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
    //     { $sort: { "invited_count": 1, "invited": 1, "feedomFighterRank.point": -1, "officialRank.point": -1 } },
    //     { $limit: parseInt(total) }
    // ])
    const selectedFreedomFighters = await FreedomFighter.aggregate([
        // { $match: { invited: { $ne: '2021' }, country: "Bangladesh" } },
        { $project: { "name": 1, "invited": 1, "officialRank": 1, "freedomFighterRank": 1, "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
        { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
        { $limit: parseInt(total) }
    ])

    const url = `{ $match: { invited: { $ne: '2021' }, country: "Bangladesh" } },
        { $project: { "name": 1, "invited": 1, "officialRank": 1, "freedomFighterRank": 1, "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
        { $sort: { ${firstCriteria}: -1, ${secondCriteria}: 1 } },
{ $limit: parseInt(${total}) } `

    // console.log(url)

    return selectedFreedomFighters;
}