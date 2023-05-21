const FreedomFighter = require("../models/FreedomFighter");


exports.clearanceReportService = async (data) => {
    console.log('report service');
    const { event, year } = data
    console.log(event, year);

    // const result = await FreedomFighter.aggregate([
    //     {
    //         $match:
    //     }
    // ])

}