const FreedomFighter = require("../models/FreedomFighter")


exports.selectFreedomFighters = async (req, res) => {
    try {

        const { total, alive, dead } = req.query;
        console.log(total)

        const selectedFreedomFighters = await FreedomFighter.aggregate([
            { $project: { "name": 1, "invited": 1, "officialRank": 1, "freedomFighterRank": 1, "invited_count": { $size: { "$ifNull": ["$invited", []] } } } },
            { $sort: { "invited_count": 1, "invited": 1, "feedomFighterRank.point": -1, "officialRank.point": -1 } },
            { $limit: parseInt(total) }
        ])
        // console.log(selectedFreedomFighters)

        res.status(200).json({
            status: 'success',
            data: selectedFreedomFighters
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message
        })
    }
}