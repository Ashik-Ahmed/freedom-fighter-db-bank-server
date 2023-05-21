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
                primarySelection: 1
            }
        }
    ])
    // console.log(result);
    return result.length;

}