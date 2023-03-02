const { getAllEventsService, addEventService } = require("../services/event.service")


exports.getAllevents = async (req, res) => {
    try {
        const events = await getAllEventsService();

        res.status(200).json({
            status: 'success',
            data: events
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message
        })
    }
}

exports.addEvent = async (req, res) => {
    try {
        const result = await addEventService(req.body);

        res.status(200).json({
            status: 'success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            error: error.message
        })
    }
}