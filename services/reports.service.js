const FreedomFighter = require("../models/FreedomFighter");


exports.clearanceReportService = async (data) => {
    console.log('report service');
    const { event, year } = data
    console.log(event, year, typeof (year));

    const result = await FreedomFighter.aggregate([
        {
            $match: {
                primarySelection: {
                    $exists: true,
                    $all: [
                        {
                            $elemMatch: {
                                event: event,
                                year: year
                            }
                        }
                    ]
                }
            }
        },
        {
            $project: {
                name: 1, force: 1
            }
        },
        {
            $group: {
                _id: "$force",
                members: { $push: "$$ROOT" }
            }
        }
    ])
    // console.log(result);
    return result;

}