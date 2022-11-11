const FreedomFighter = require('../models/FreedomFighter');
const { insertFreedomFighterService, updateFreedomFighterByIdService, deleteFreedomFighterByIdService } = require('../services/freedomFighter.service');




// insert a new freedom fighter
exports.insertFreedomFighter = async (req, res) => {
    try {
        const freedomFighter = await insertFreedomFighterService(req.body)

        res.status(200).json({
            status: 'success',
            message: 'Successfully inserted freedom fighter'
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error
        })
    }
}

// get freedom fighters from database 
exports.getFreedomFighters = async (req, res) => {
    try {
        const freedomFighters = await FreedomFighter.find({})

        res.status(200).json({
            status: 'success',
            data: freedomFighters
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: 'Internal Server Error',
        })
    }
}



// update a freedom fighter 
exports.updateFreedomFighterById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateFreedomFighterByIdService(id, req.body);

        if (!result.modifiedCount) {
            return res.status(200).json({
                status: 'failed',
                message: "Couldn't update. Please try again"
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'Successfully updated',
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message
        })
    }
}


//delete a freedom fighter
exports.deleteFreedomFighterById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteFreedomFighterByIdService(id);

        if (!result.deletedCount) {
            return res.status(400).json({
                status: 'failed',
                error: "Couldn't delete the product"
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Successfully deleted',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error
        })
    }
}