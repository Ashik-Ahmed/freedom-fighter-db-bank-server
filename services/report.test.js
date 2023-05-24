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
                aliveOfficerApproved: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Alive"] },
                                    { $gt: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Success"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                aliveOfficerRejected: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Alive"] },
                                    { $gt: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Failed"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
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
                aliveJCOApproved: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Alive"] },
                                    { $lte: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Success"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                aliveJCORejected: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Alive"] },
                                    { $lte: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Failed"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
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
                deadOfficerApproved: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Dead"] },
                                    { $gt: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Success"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                deadOfficerRejected: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Dead"] },
                                    { $gt: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Failed"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
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
                },
                deadJCOApproved: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Dead"] },
                                    { $lte: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Success"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                deadJCORejected: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    // { $eq: ["$primarySelection.verificationStatus.status", "Success"] },
                                    { $eq: ["$status", "Dead"] },
                                    { $lte: ["$officialRank.point", 13] },
                                    {
                                        $anyElementTrue: {
                                            $map: {
                                                input: "$primarySelection",
                                                as: "ps",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$ps.event", event] },
                                                        { $eq: ["$$ps.year", year] },
                                                        { $eq: ["$$ps.verificationStatus.status", "Failed"] }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
            }
        },
        {
            $project: {
                _id: 0,
                force: "$_id",
                aliveOfficer: 1,
                aliveOfficerApproved: 1,
                aliveOfficerRejected: 1,
                aliveJCO: 1,
                aliveJCOApproved: 1,
                aliveJCORejected: 1,
                totalAliveProposed: { $add: ["$aliveOfficerApproved", "$aliveJCOApproved"] },
                deadOfficer: 1,
                deadOfficerApproved: 1,
                deadOfficerRejected: 1,
                deadJCO: 1,
                deadJCOApproved: 1,
                deadJCORejected: 1,
                totalDeadProposed: { $add: ["$deadOfficerApproved", "$deadJCOApproved"] },
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
    const mergedresult = [...result, ...previousYearResult]

    const mergedReport = mergedresult.reduce((result, obj) => {
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
    console.log(mergedReport);
    return mergedReport;
}