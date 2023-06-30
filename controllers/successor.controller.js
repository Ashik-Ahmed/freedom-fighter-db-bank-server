const Successor = require('../models/Successor');
const { createSuccessorService, getSuccessorByFreedomFighterIdService, deleteSuccessorByIdService } = require('../services/successor.service');


// create a new successor 
exports.createSuccessor = async (req, res) => {
    try {
        const successor = await createSuccessorService(req.body);
        // console.log(req.body);
        // console.log(successor)

        res.status(200).json({
            status: 'Success',
            message: 'Successfully Added Successor'
        })

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }

}


//get successor by freedom fighter id
exports.getSuccessorByFreedomFighterId = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const successorDetails = await getSuccessorByFreedomFighterIdService(id)

        res.status(200).json({
            status: 'success',
            data: successorDetails
        })

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message
        })
    }
}


//delete a successor by id
exports.deleteSuccessorById = async (req, res) => {
    try {

        const { freedomFighterId } = req.body;
        const { id } = req.params;

        const result = await deleteSuccessorByIdService(freedomFighterId, id);

        res.status(200).json({
            status: 'Success',
            data: result
        })

        // console.log(result);

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message || 'Failed! Please try again'
        })
    }
}