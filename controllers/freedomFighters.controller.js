const FreedomFighter = require('../models/FreedomFighter');
const { insertFreedomFighterService, updateFreedomFighterByIdService, deleteFreedomFighterByIdService } = require('../services/freedomFighter.service');

// const multer = require('multer');

// const uploader = multer({
//     dest: './profilePhotos/'
// })

// upload profile photo
exports.profilePhotoUpload = async (req, res) => {

    // res.send(req.file.path)
    try {
        console.log(req.file.path)
        res.status(200).send(req.file.path)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


// insert a new freedom fighter
exports.insertFreedomFighter = async (req, res) => {
    try {
        const freedomFighter = await insertFreedomFighterService(req.body)

        res.status(200).json({
            status: 'success',
            message: 'Successfully inserted freedom fighter',
            data: freedomFighter,
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error
        })
    }
    // console.log(req.body)
    // res.send('success')
}

// get freedom fighters from database 
exports.getFreedomFighters = async (req, res) => {
    try {
        // const result = await FreedomFighter.find().lean()
        const fighters = await FreedomFighter.find({}).limit(2)
        // const result = await fighters.json();

        res.status(200).json(fighters)

        // res.status(200).json({
        //     status: 'success',
        //     data: JSON.stringify(result)
        // })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message,
        })
    }
}


// get a single freedom fighter from database 
exports.getSingleFreedomFighter = async (req, res) => {
    try {
        const { id } = req.params;
        const fighters = await FreedomFighter.find({ _id: id })
        // const result = await fighters.json();

        res.status(200).json(fighters)

        // res.status(200).json({
        //     status: 'success',
        //     data: JSON.stringify(result)
        // })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message,
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