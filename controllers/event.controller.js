const { getAllEventsService, addEventService, updateEventService } = require("../services/event.service")


exports.getAllevents = async (req, res) => {
    try {
        const events = await getAllEventsService();

        res.status(200).json({
            status: 'Success',
            data: events
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.addEvent = async (req, res) => {
    try {
        const result = await addEventService(req.body);

        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const result = await updateEventService(req.body)
        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        console.log(req.params);
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}