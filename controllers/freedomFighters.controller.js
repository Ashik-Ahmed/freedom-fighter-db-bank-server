const FreedomFighter = require('../models/FreedomFighter');
const { insertFreedomFighterService, updateFreedomFighterByIdService, deleteFreedomFighterByIdService, getFreedomFightersService } = require('../services/freedomFighter.service');
const fs = require('fs');

// upload profile photo
exports.profilePhotoUpload = async (req, res) => {

    // res.send(req.file.path)
    try {
        // console.log(req.file.path)
        res.status(200).send(req.file.path)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


// insert a new freedom fighter
exports.insertFreedomFighter = async (req, res) => {
    console.log('backend api called for insertion');

    try {

        const memberInfo = req.body;
        memberInfo.photo = req.file.filename

        if (memberInfo?.officialRank) {
            const officeRank = JSON.parse(memberInfo?.officialRank);
            memberInfo.officialRank = officeRank
        }
        if (memberInfo?.freedomFighterRank) {
            const fighterRank = JSON.parse(memberInfo?.freedomFighterRank);
            memberInfo.freedomFighterRank = fighterRank
        }
        // console.log('printing file Name');
        // console.log(memberInfo)

        const freedomFighter = await insertFreedomFighterService(memberInfo)
        // console.log(freedomFighter);

        if (freedomFighter._id) {
            res.status(200).json({
                status: 'Success',
                data: freedomFighter,
            })
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'Operation Failed! Please try again',
            })
        }
    } catch (error) {
        console.log(error.message)

        // res.writeHead(500, { 'content-type': 'text/html' });
        // res.write(error.message);
        // res.end();

        res.status(500).json({
            status: 'Failed',
            error: error.message || 'Operation Failed! Please try again'
        })
    }
    // console.log(req.body)
    // res.send('success')
}

// get freedom fighters from database 
exports.getFreedomFighters = async (req, res) => {
    try {
        const fightersData = await getFreedomFightersService(req)
        // console.log(fightersData);

        res.status(200).json(fightersData)

        // res.status(200).json({
        //     status: 'success',
        //     data: JSON.stringify(result)
        // })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}


// get a single freedom fighter from database 
exports.getSingleFreedomFighter = async (req, res) => {
    try {
        const { id } = req.params;
        const fighter = await FreedomFighter.find({ _id: id })

        if (fighter[0].photo) {
            const image = fs.readFileSync(`profilePhotos/${fighter[0]?.photo}`, (err, data) => {
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
            fighter[0].profilePhoto = image;
        }
        // console.log(fighter);
        res.status(200).json(fighter)

        // res.status(200).json({
        //     status: 'success',
        //     data: JSON.stringify(result)
        // })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message,
        })
    }
}



// update a freedom fighter 
exports.updateFreedomFighterById = async (req, res) => {
    console.log('update api hit');
    try {
        const { id } = req.params;
        const updatedMemberData = req.body;

        if (updatedMemberData?.officialRank) {
            const officeRank = JSON.parse(updatedMemberData?.officialRank);
            updatedMemberData.officialRank = officeRank
        }
        if (updatedMemberData?.freedomFighterRank) {
            const fighterRank = JSON.parse(updatedMemberData?.freedomFighterRank);
            updatedMemberData.freedomFighterRank = fighterRank
        }

        const result = await updateFreedomFighterByIdService(id, req.body);
        // console.log(result);

        if (!result.modifiedCount) {
            return res.status(200).json({
                status: 'Failed',
                message: "Couldn't update. Please try again"
            })
        }
        else {
            return res.status(200).json({
                status: 'Success',
                message: 'Successfully updated',
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
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
                status: 'Failed',
                error: "Couldn't delete the product"
            })
        }

        res.status(200).json({
            status: 'Success',
            message: 'Successfully deleted',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error
        })
    }
}