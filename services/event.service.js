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
    const { eventId, updatedData } = data
    // console.log(updatedData);
    const result = await Event.updateOne({ _id: eventId }, { $set: updatedData })
    console.log(result);
    return result;
}

exports.deleteEventService = async (id) => {
    const result = await Event.deleteOne({ _id: id })
    console.log(result);
    return result;
}