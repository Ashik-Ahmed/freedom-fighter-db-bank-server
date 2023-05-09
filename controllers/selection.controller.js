const { sendMailWithGmail } = require("../middleware/emailSend");
const FreedomFighter = require("../models/FreedomFighter");
const { getSelectedFreedomFightersService, updateTemporarySelectedMembersService, getPrimarySelectedMembersService, verificationUpdateService, deletePrimarySelectedMemberService, getFinalSelectedMembersService, sendInvitationMailService, } = require("../services/selection.service");
const QRCode = require('qrcode')

exports.selectFreedomFighters = async (req, res) => {
    try {
        const { alivePercentage, deadPercentage, } = JSON.parse(req.query.data);
        console.log('percentage: ', alivePercentage, deadPercentage,);

        if (parseInt(alivePercentage) + parseInt(deadPercentage) != 100) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Percentage count not right'
            })
        }
        const selectedFreedomFighters = await getSelectedFreedomFightersService(req.query)
        res.status(200).json({
            status: 'Success',
            data: selectedFreedomFighters
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}


exports.temporarySelected = async (req, res) => {
    try {
        const result = await updateTemporarySelectedMembersService(req.body);
        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.getPrimarySelectedMembers = async (req, res) => {
    try {
        const result = await getPrimarySelectedMembersService(req.query)
        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.verificationUpdate = async (req, res) => {
    try {
        const result = await verificationUpdateService(req.body)
        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.deletePrimarySelectedMember = async (req, res) => {
    try {
        const result = await deletePrimarySelectedMemberService(req.body)

        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}


exports.getFinalSelectedMembers = async (req, res) => {
    try {
        const result = await getFinalSelectedMembersService(req.query)
        res.status(200).json({
            status: 'Success',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}

exports.sendInvitationmail = async (req, res) => {
    try {
        console.log('email send controller');
        const { memberId, memberName, eventToBeUpdate, mailData } = req.body;
        // console.log(memberId, eventToBeUpdate, mailData);
        const qrCodeData = {
            memberId,
            memberName,
            invitationText: mailData.text,
            event: eventToBeUpdate.name,
            year: eventToBeUpdate.year,
        }

        //comment out as the qr code is now generating in the generateInitationCard middleware file
        // generate the QR code as buffer 

        // QRCode.toBuffer(JSON.stringify(qrCodeData), { type: 'png' }, function (err, buffer) {
        //     if (err) {
        //         res.status(400).send('QR Code generation failed');
        //         console.log(err)
        //         return;
        //     }

        //     // append the generated QR code tothe mailData 
        //     mailData.attachments = [
        //         {
        //             filename: 'qr-code.png',
        //             content: buffer,
        //             contentType: 'image/png'
        //         }
        //     ];
        // })

        const emailSend = await sendMailWithGmail({ mailInfo: mailData, qrCodeData })
        console.log('emailsend Data', emailSend);

        if (emailSend.messageId) {
            const updateData = {
                memberId,
                eventToBeUpdate,
                invitationMail: 'Sent'
            }
            // now update the invitationMail field of that specific event 
            // const result = await sendInvitationMailService(updateData);
            if (result.modifiedCount > 0) {
                res.status(200).json({
                    status: 'Success',
                    data: result
                })
            }
            else {
                res.status(400).json({
                    status: 'Failed',
                    error: 'Operation failed. Please try again'
                })
            }
        }
        else {
            res.status(400).json({
                status: 'Failed',
                error: 'Operation failed. Please try again'
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        })
    }
}




// Test Controller 
exports.testSelection = async (req, res) => {

    const { total, alive, dead, memberType, eventDetails, selectionCriteria, excludePreviousYear } = req.body;

    console.log(total, alive, dead, memberType, eventDetails, selectionCriteria, excludePreviousYear);

    // console.log(req.body);
    const sortOrder = [];

    for (const key in selectionCriteria) {
        if (selectionCriteria.hasOwnProperty(key)) {
            sortOrder.push({
                field: selectionCriteria[key],
                direction: 1
            })
        }
    }

    // const selectedMembers = await FreedomFighter.aggregate([
    //     {
    //         $match: {
    //             category: memberType,
    //             vipStatus: { $ne: true }
    //         }
    //     },
    //     {
    //         $project: {
    //             "name": 1, "category": 1, "force": 1, "status": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
    //             invitedYear: {
    //                 $map: {
    //                     input: {
    //                         $filter: {
    //                             input: { $ifNull: ["$primarySelection", []] },
    //                             as: "sel",
    //                             cond: { $eq: ["$$sel.verificationStatus.status", "Success"] }
    //                         }
    //                     },
    //                     as: "filteredSel",
    //                     in: "$$filteredSel.year"
    //                 }
    //             },
    //             invitationCount: {
    //                 $size: {
    //                     $filter: {
    //                         input: { $ifNull: ["$primarySelection", []] },
    //                         as: "elem",
    //                         cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
    //                     }
    //                 }
    //             }
    //         }
    //     },

    //     {
    //         $sort: sortOrder.reduce((acc, sort) => {
    //             acc[sort.field] = sort.direction == 1 ? 1 : -1;
    //             return acc;
    //         }, {})
    //     },
    //     { $limit: parseInt(total) }
    // ])
    // res.status(500).json({
    //     status: 'Success',
    //     data: selectedMembers.length
    // })

    // const totalMembers = await FreedomFighter.countDocuments({ category: memberType, vipStatus: { $ne: true } });

    console.log('total percentage: ', parseInt(alive) + parseInt(dead));
    if (parseInt(alive) + parseInt(dead) != 100) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Percentage count not right'
        })
    }

    const aliveMembers = Math.round(total * (alive / 100));
    const deadMembers = Math.round(total * (dead / 100));


    console.log(aliveMembers);
    console.log(deadMembers);

    // const selectedMembers = await FreedomFighter.aggregate([
    //     {
    //         $match: {
    //             category: memberType,
    //             vipStatus: { $ne: true }
    //         }
    //     },
    //     {
    //         $project: {
    //             "name": 1,
    //             "category": 1,
    //             // "force": 1,
    //             "status": 1,
    //             // "invited": 1,
    //             // "forceRank": "$officialRank.rank",
    //             // "officialRank": 1,
    //             // "freedomFighterRank": 1,
    //             // "fighterRank": "$freedomFighterRank.rank",
    //             // "fighterPoint": "$freedomFighterRank.point",
    //             invitedYear: {
    //                 $map: {
    //                     input: {
    //                         $filter: {
    //                             input: { $ifNull: ["$primarySelection", []] },
    //                             as: "sel",
    //                             cond: { $eq: ["$$sel.verificationStatus.status", "Success"] }
    //                         }
    //                     },
    //                     as: "filteredSel",
    //                     in: "$$filteredSel.year"
    //                 }
    //             },
    //             invitationCount: {
    //                 $size: {
    //                     $filter: {
    //                         input: { $ifNull: ["$primarySelection", []] },
    //                         as: "elem",
    //                         cond: { $eq: ["$$elem.verificationStatus.status", "Success"] }
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $match: {
    //             $or: [
    //                 { status: "Alive" },
    //                 { status: "Dead" }
    //             ]
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: "$status",
    //             count: { $sum: 1 },
    //             docs: { $push: "$$ROOT" }
    //         }
    //     },
    //     {
    //         $project: {
    //             docs: {
    //                 $slice: [
    //                     "$docs",
    //                     {
    //                         $cond: {
    //                             if: { $eq: ["$_id", "Alive"] },
    //                             then: { $floor: { $multiply: [0.7, "$count"] } },
    //                             else: { $ceil: { $multiply: [0.3, "$count"] } }
    //                         }
    //                     }
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $unwind: "$docs"
    //     },
    //     {
    //         $replaceRoot: { newRoot: "$docs" }
    //     },
    //     {
    //         $sort: sortOrder.reduce((acc, sort) => {
    //             acc[sort.field] = sort.direction == 1 ? 1 : -1;
    //             return acc;
    //         }, {})
    //     },
    //     { $limit: parseInt(total) }
    // ]);

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
                "name": 1, "category": 1, "force": 1, "status": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
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
        { $limit: parseInt(aliveMembers) }
    ]);


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
                "name": 1, "category": 1, "force": 1, "status": 1, "invited": 1, "forceRank": "$officialRank.rank", "officialRank": 1, "freedomFighterRank": 1, "fighterRank": "$freedomFighterRank.rank", "fighterPoint": "$freedomFighterRank.point",
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
        { $limit: parseInt(deadMembers) }
    ]);
    // console.log(selectedMembers);

    const selectedMembers = [];
    selectedMembers.push(...aliveSelectedMembers)
    selectedMembers.push(...deadSelectedMembers)

    const aliveCount = selectedMembers.filter(member => member.status == 'Alive').length
    const deadCount = selectedMembers.filter(member => member.status == 'Dead').length

    console.log(selectedMembers.length, aliveSelectedMembers.length, deadSelectedMembers.length);

    res.status(200).json({
        status: 'Success',
        data: {
            total: selectedMembers.length,
            alive: aliveSelectedMembers.length,
            dead: deadSelectedMembers.length
        }
    })
}