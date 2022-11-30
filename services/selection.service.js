const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (total) => {
    const selectedFreedomFighters = await FreedomFighter.aggregate([
        { $project: { "name": 1, "invited": 1, "officialRank": 1, "freedomFighterRank": 1, "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
        { $sort: { "invited_count": 1, "invited": 1, "feedomFighterRank.point": -1, "officialRank.point": -1 } },
        { $limit: parseInt(total) }
    ])

    return selectedFreedomFighters;
}