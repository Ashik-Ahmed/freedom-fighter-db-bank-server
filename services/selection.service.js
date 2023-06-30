const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (data) => {

    // const { total, alivePercentage, deadPercentage, memberType, eventDetails, selectionCriteria, excludePreviousYear } = JSON.parse(data.data);
    const { total, aliveMembersCount, deadMembersCount, memberType, eventDetails, selectionCriteria, excludePreviousYear } = data;

    // const { memberType, total, selectionCriteria, excludePreviousYear, yearOfInvitation } = data;
    // console.log(total, memberType, eventDetails, selectionCriteria, excludePreviousYear);
    // const sortCriteria = JSON.parse(selectionCriteria)

    // const aliveMembersCount = parseInt(Math.round(total * (alivePercentage / 100)));
    // var deadMembersCount = parseInt(Math.round(total * (deadPercentage / 100)));

    const sortOrder = [];

    for (const key in selectionCriteria) {
        if (selectionCriteria.hasOwnProperty(key)) {
            sortOrder.push({
                field: selectionCriteria[key],
                direction: 1
            })
        }
    }

    const vipMembers = await FreedomFighter.aggregate([
        {
            $match:
            {
                $and: [
                    { category: memberType },
                    { vipStatus: true }
                ]
            }
        },
        {
            $project: {
                "name": 1, "category": 1, "vipStatus": 1, "force": 1, "status": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
                invitedYear: {
                    $map: {
                        input: {
                            $filter: {
                                input: { $ifNull: ["$primarySelection", []] },
                                as: "sel",
                                cond: { $eq: ["$$sel.verificationStatus.status", "Success"] }
                            }
                        },
                        as: "filteredSel",
                        in: "$$filteredSel.year"
                    }
                },
                invitationCount: {
                    $size: {
                        $filter: {
                            input: { $ifNull: ["$primarySelection", []] },
                            as: "elem",
                            cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
                        }
                    }
                }
            }
        }
    ])
    // console.log(vipMembers);


    var selectedMembers = []
    if (!excludePreviousYear) {
        if (aliveMembersCount > 0) {
            const aliveSelectedMembers = await FreedomFighter.aggregate([
                {
                    $match:
                    {
                        category: memberType,
                        vipStatus: { $ne: true },
                        status: 'Alive'


                        //     $or: [
                        //         {
                        //             $and: [
                        //                 { vipStatus: false },
                        //                 { category: memberType },
                        //             ]
                        //         },
                        //         { vipStatus: true },
                        //         { vipStatus: { $exists: false } },
                        //     ]
                    }
                },
                {
                    $project: {
                        "name": 1, "category": 1,
                        "vipStatus": 1, "force": 1, "status": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
                        invitedYear: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: { $ifNull: ["$primarySelection", []] },
                                        as: "sel",
                                        cond: { $eq: ["$$sel.verificationStatus.status", "Success"] }
                                    }
                                },
                                as: "filteredSel",
                                in: "$$filteredSel.year"
                            }
                        },
                        invitationCount: {
                            $size: {
                                $filter: {
                                    input: { $ifNull: ["$primarySelection", []] },
                                    as: "elem",
                                    cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: sortOrder.reduce((acc, sort) => {
                        acc[sort.field] = sort.direction == 1 ? 1 : -1;
                        return acc;
                    }, {})
                },
                { $limit: parseInt(aliveMembersCount) }

            ])
            selectedMembers.push(...aliveSelectedMembers);
        }


        if (deadMembersCount > 0) {
            const deadSelectedMembers = await FreedomFighter.aggregate([
                {
                    $match:
                    {
                        category: memberType,
                        vipStatus: { $ne: true },
                        status: 'Dead'


                        //     $or: [
                        //         {
                        //             $and: [
                        //                 { vipStatus: false },
                        //                 { category: memberType },
                        //             ]
                        //         },
                        //         { vipStatus: true },
                        //         { vipStatus: { $exists: false } },
                        //     ]
                    }
                },
                {
                    $project: {
                        "name": 1, "category": 1,
                        "vipStatus": 1, "force": 1, "status": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
                        invitedYear: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: { $ifNull: ["$primarySelection", []] },
                                        as: "sel",
                                        cond: { $eq: ["$$sel.verificationStatus.status", "Success"] }
                                    }
                                },
                                as: "filteredSel",
                                in: "$$filteredSel.year"
                            }
                        },
                        invitationCount: {
                            $size: {
                                $filter: {
                                    input: { $ifNull: ["$primarySelection", []] },
                                    as: "elem",
                                    cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: sortOrder.reduce((acc, sort) => {
                        acc[sort.field] = sort.direction == 1 ? 1 : -1;
                        return acc;
                    }, {})
                },
                { $limit: parseInt(deadMembersCount) }

            ])

            selectedMembers.push(...deadSelectedMembers)
        }

    }

    else {
        if (aliveMembersCount > 0) {
            const aliveSelectedMembers = await FreedomFighter.aggregate([
                {
                    $match: {
                        category: memberType,
                        vipStatus: { $ne: true },
                        status: 'Alive',
                        primarySelection: {
                            $not: {
                                $elemMatch: {
                                    $and: [
                                        {
                                            event: eventDetails.event
                                        },
                                        {
                                            year: (eventDetails.year - 1).toString()    //converting to String as year field declared as String in the model
                                        },
                                        {
                                            verificationStatus: { status: 'Success' }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        "name": 1,
                        "category": 1,
                        "vipStatus": 1,
                        "force": 1,
                        "status": 1,
                        "invited": 1,
                        "forceRank": "$officialRank.rank",
                        "officialRank": 1,
                        "freedomFighterRank": 1,
                        "fighterRank": "$freedomFighterRank.rank",
                        "fighterPoint": "$freedomFighterRank.point",
                        invitedYear: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: { $ifNull: ["$primarySelection", []] },
                                        as: "sel",
                                        cond: { $eq: ["$$sel.verificationStatus.status", "Success"] }
                                    }
                                },
                                as: "filteredSel",
                                in: "$$filteredSel.year"
                            }
                        },
                        invitationCount: {
                            $size: {
                                $filter: {
                                    input: { $ifNull: ["$primarySelection", []] },
                                    as: "elem",
                                    cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
                                }
                            }
                        }
                    }
                },

                // reduce() function creates an object that maps each sort field to its corresponding sort direction. We then pass this object to the $sort stage, which will apply the sorting based on the keys in the object.
                {
                    $sort: sortOrder.reduce((acc, sort) => {
                        acc[sort.field] = sort.direction == 1 ? 1 : -1;
                        return acc;
                    }, {})
                },
                { $limit: parseInt(aliveMembersCount) }
            ])
            selectedMembers.push(...aliveSelectedMembers);
        }


        if (deadMembersCount > 0) {
            const deadSelectedMembers = await FreedomFighter.aggregate([
                {
                    $match: {
                        category: memberType,
                        vipStatus: { $ne: true },
                        status: 'Dead',
                        primarySelection: {
                            $not: {
                                $elemMatch: {
                                    $and: [
                                        {
                                            event: eventDetails.event
                                        },
                                        {
                                            year: (eventDetails.year - 1).toString()    //converting to String as year field declared as String in the model
                                        },
                                        {
                                            verificationStatus: { status: 'Success' }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        "name": 1,
                        "category": 1,
                        "vipStatus": 1,
                        "force": 1,
                        "status": 1,
                        "invited": 1,
                        "forceRank": "$officialRank.rank",
                        "officialRank": 1,
                        "freedomFighterRank": 1,
                        "fighterRank": "$freedomFighterRank.rank",
                        "fighterPoint": "$freedomFighterRank.point",
                        invitedYear: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: { $ifNull: ["$primarySelection", []] },
                                        as: "sel",
                                        cond: { $eq: ["$$sel.verificationStatus.status", "Success"] }
                                    }
                                },
                                as: "filteredSel",
                                in: "$$filteredSel.year"
                            }
                        },
                        invitationCount: {
                            $size: {
                                $filter: {
                                    input: { $ifNull: ["$primarySelection", []] },
                                    as: "elem",
                                    cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
                                }
                            }
                        }
                    }
                },

                // reduce() function creates an object that maps each sort field to its corresponding sort direction. We then pass this object to the $sort stage, which will apply the sorting based on the keys in the object.
                {
                    $sort: sortOrder.reduce((acc, sort) => {
                        acc[sort.field] = sort.direction == 1 ? 1 : -1;
                        return acc;
                    }, {})
                },
                { $limit: parseInt(deadMembersCount) }
            ])

            selectedMembers.push(...deadSelectedMembers)
        }

    }
    vipMembers.push(...selectedMembers)
    const allSelectedMembers = vipMembers;
    // console.log(selectedFreedomFighters);
    return allSelectedMembers;
}

exports.updateTemporarySelectedMembersService = async (data) => {
    const { memberIds, event, year } = data
    const result = await FreedomFighter.updateMany({ _id: { $in: memberIds } }, { $push: { primarySelection: { event: event, year: year } } }, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(`${res.nModified} documents updated`);
    });
    return result;
}

exports.getPrimarySelectedMembersService = async (data) => {
    // console.log(data);
    const result = await FreedomFighter.aggregate([
        {
            $match: {
                primarySelection: {
                    $elemMatch: {
                        event: data.event,
                        year: data.year
                    }
                }
            }
        }
    ])
    return result;
}

exports.verificationUpdateService = async (data) => {
    const { memberId, eventToBeUpdate, verificationStatus } = data;
    // console.log(memberId, eventToBeUpdate, verificationStatus);
    const result = await FreedomFighter.updateOne({ _id: memberId, primarySelection: eventToBeUpdate }, { $set: { 'primarySelection.$.verificationStatus': verificationStatus } })

    return result;
}

exports.deletePrimarySelectedMemberService = async (data) => {
    const { eventToBeUpdate, memberId } = data;
    // console.log(eventToBeUpdate, memberId);
    const result = await FreedomFighter.updateOne({ _id: memberId }, { $pull: { primarySelection: { _id: eventToBeUpdate._id } } })
    return result
}

exports.getFinalSelectedMembersService = async (data) => {
    const result = await FreedomFighter.aggregate([
        {
            $match: {
                primarySelection: {
                    $elemMatch: {
                        event: data.event,
                        year: data.year,
                        'verificationStatus.status': 'Success'
                    }
                }
            }
        }
    ])
    return result;
}

exports.sendInvitationMailService = async (data) => {
    const { memberId, eventToBeUpdate, invitationMail } = data;
    // console.log(memberId, eventToBeUpdate, invitationMail);
    const result = await FreedomFighter.updateOne({ _id: memberId, primarySelection: { $elemMatch: { event: eventToBeUpdate.name, year: eventToBeUpdate.year } } }, { $set: { "primarySelection.$.invitationMail": invitationMail } });

    console.log(result);
    return result;
}