const FreedomFighter = require("../models/FreedomFighter");
const { getSelectedFreedomFightersService } = require("../services/selection.service");


exports.selectFreedomFighters = async (req, res) => {
    try {

        const { total, alive, dead } = req.query;

        const selectedFreedomFighters = await getSelectedFreedomFightersService(total)

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