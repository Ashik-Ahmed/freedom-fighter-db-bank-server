const Event = require("../models/Events")


exports.getAllEventsService = async () => {
    const events = await Event.find({})
    return events;
}

exports.addEventService = async (eventData) => {
    const result = await Event.create(eventData);
    return result;
}