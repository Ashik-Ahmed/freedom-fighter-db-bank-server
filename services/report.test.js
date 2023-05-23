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
                previousAliveOfficer: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Alive"] }, { $gt: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                previousAliveJCO: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Alive"] }, { $lte: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                previousDeadOfficer: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$status", "Dead"] }, { $gt: ["$officialRank.point", 13] }] },
                            1,
                            0
                        ]
                    }
                },
                previousDeadJCO: {
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
                previousAliveOfficer: 1,
                previousAliveJCO: 1,
                previousDeadOfficer: 1,
                previousDeadJCO: 1
            }
        }
    ])
    // console.log(result.length);
    const reportData = [...result, ...previousYearResult]

    const mergedObjects = reportData.reduce((result, obj) => {
        const force = obj.force;
        const existingObj = result.find(item => item.force === force);

        if (existingObj) {
            // Merge the current object with the existing object
            Object.assign(existingObj, obj);
        } else {
            // Add the current object as a new entry
            result.push(obj);
        }

        return result;
    }, []);
    console.log(mergedObjects);
    return mergedObjects;
}