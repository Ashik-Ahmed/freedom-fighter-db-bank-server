const Event = require("../models/Events")


exports.getAllEventsService = async (data) => {
    const events = await Event.find({})
    return events;
}