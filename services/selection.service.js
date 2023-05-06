const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (data) => {

    const { total, alive, dead, memberType, eventDetails, selectionCriteria, excludePreviousYear } = JSON.parse(data.data);

    // const { memberType, total, selectionCriteria, excludePreviousYear, yearOfInvitation } = data;
    // console.log(memberType, total, selectionCriteria, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear);
    // console.log(total, memberType, eventDetails, selectionCriteria, excludePreviousYear);
    // const sortCriteria = JSON.parse(selectionCriteria)

    const sortOrder = [];

    for (const key in selectionCriteria) {
        if (selectionCriteria.hasOwnProperty(key)) {
            sortOrder.push({
                field: selectionCriteria[key],
                direction: 1
            })
        }
    }
    // sortOrder.push({
    //     field: "primarySelection.year",
    //     direction: 1
    // })
    console.log(sortOrder);

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
                "name": 1, "category": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
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


    var selectedFreedomFighters = []
    if (!excludePreviousYear) {
        selectedFreedomFighters = await FreedomFighter.aggregate([
            {
                $match:
                {
                    category: memberType,
                    vipStatus: { $ne: true }


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
                    "name": 1, "category": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
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
            { $limit: parseInt(total) }
        ])
    }

    else {
        selectedFreedomFighters = await FreedomFighter.aggregate([
            {
                $match: {
                    category: memberType,
                    vipStatus: { $ne: true },
                    // $expr: {
                    //     $gt: [
                    //         { $size: { $ifNull: ['$primarySelection', []] } }, 0   //checking if primarySelection field is empty or not
                    //     ]
                    // },
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
                    "name": 1, "category": 1, "force": 1, "invitedYear": "$primarySelection.year", "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point", invitationCount: {
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
            { $limit: parseInt(total) }
        ])
    }
    vipMembers.push(...selectedFreedomFighters)
    const allSelectedMembers = vipMembers;
    // console.log(allSelectedMembers);
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