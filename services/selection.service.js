const FreedomFighter = require("../models/FreedomFighter");


//get selected freedom fighters
exports.getSelectedFreedomFightersService = async (data) => {

    const { memberType, total, selectionCriteria, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear } = data;
    // console.log(memberType, total, selectionCriteria, firstCriteria, secondCriteria, thirdCriteria, excludePreviousYear);
    const sortCriteria = JSON.parse(selectionCriteria)

    const sortOrder = [];

    for (const key in sortCriteria) {
        if (sortCriteria.hasOwnProperty(key)) {
            sortOrder.push({
                field: sortCriteria[key],
                direction: 1
            })
        }
    }
    // console.log(sortOrder);



    var selectedFreedomFighters = []
    if (excludePreviousYear == 'false') {
        selectedFreedomFighters = await FreedomFighter.aggregate([
            { $match: { category: memberType } },
            {
                $project: {
                    "name": 1, "category": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point", invitationCount: {
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
            // { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
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
            { $match: { invited: { $ne: '2021' }, category: memberType } },
            {
                $project: {
                    "name": 1, "category": 1, "force": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point", invitationCount: {
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
            // { $sort: { [firstCriteria]: 1, [secondCriteria]: 1, [thirdCriteria]: 1 } },
            {
                $sort: sortOrder.reduce((acc, sort) => {
                    acc[sort.field] = sort.direction == 1 ? 1 : -1;
                    return acc;
                }, {})
            },
            { $limit: parseInt(total) }
        ])
    }
    console.log('result: ', selectedFreedomFighters);
    return selectedFreedomFighters;
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
        { $match: { 'primarySelection.event': data.event, 'primarySelection.year': data.year } }
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
        { $match: { 'primarySelection.event': data.event, 'primarySelection.year': data.year, 'primarySelection.verificationStatus.status': 'Success' } }
    ])
    return result;
}

exports.sendInvitationMailService = async (data) => {
    const { memberId, eventToBeUpdate, invitationMail } = data;
    console.log(memberId, eventToBeUpdate, invitationMail);
    const result = await FreedomFighter.updateOne({ _id: memberId, primarySelection: { $elemMatch: { _id: eventToBeUpdate._id } } }, { $set: { "primarySelection.$.invitationMail": invitationMail } });

    console.log(result);
    return result;
}