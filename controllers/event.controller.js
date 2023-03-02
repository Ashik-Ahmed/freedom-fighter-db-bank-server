const { getAllEventsService } = require("../services/event.service")


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