const FreedomFighter = require("../models/FreedomFighter")

exports.getReportService = async (data) => {

    const { event, year } = data

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
            $group: {
                _id: "$force",
                aliveOfficer: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Alive"] }, { $gt: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                aliveJCO: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Alive"] }, { $lte: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                deadOfficer: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Dead"] }, { $gt: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                deadJCO: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Dead"] }, { $lte: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                force: "$_id",
                aliveOfficer: 1,
                aliveJCO: 1,
                deadOfficer: 1,
                deadJCO: 1
            }
        }
    ])

    const previousYearResult = await FreedomFighter.aggregate([
        {
            $match: {
                primarySelection: {
                    $exists: true,
                    $all: [
                        {
                            $elemMatch: {
                                event: event,
                                year: (year - 1).toString()
                            }
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$force",
                aliveOfficer: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Alive"] }, { $gt: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                aliveJCO: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Alive"] }, { $lte: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                deadOfficer: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Dead"] }, { $gt: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                deadJCO: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Dead"] }, { $lte: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                force: "$_id",
                aliveOfficer: 1,
                aliveJCO: 1,
                deadOfficer: 1,
                deadJCO: 1
            }
        }
    ])
    // console.log(result.length);
    const reportData = [...result, ...previousYearResult]
    return reportData;
}