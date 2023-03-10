const Event = require("../models/Events")


exports.getAllEventsService = async () => {
    const events = await Event.find({})
    return events;
}

exports.addEventService = async (eventData) => {
    console.log(eventData);
    const result = await Event.create(eventData);
    return result;
}

exports.updateEventService = async (data) => {
    const { eventId, email } = data
    const result = await Event.updateOne({ _id: eventId }, { $set: { email } })
    console.log(result);
    return result;
}