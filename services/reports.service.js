const FreedomFighter = require("../models/FreedomFighter");


exports.clearanceReportService = async (data) => {
    console.log('report service');
    const { event, year } = data

    const currentReport = [];
    const previousYearReport = []

    const members = await FreedomFighter.aggregate([
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


    members.map(force => {
        // console.log(force._id);
        // console.log(force.members.length);
        // const forceData = {};
        const totalAliveOfficerSent = force.members.filter(member => {
            if (member.status == 'Alive' && member.officialRank.point > 13) {
                return member;
            }
            // console.log(member);
        });
        const totalAliveORSent = force.members.filter(member => {
            if (member.status == 'Alive' && member.officialRank.point < 13) {
                return member;
            }
        });
        const totalDeadOfficerSent = force.members.filter(member => {
            if (member.status == 'Dead' && member.officialRank.point > 13) {
                return member;
            }
        });
        const totalDeadORSent = force.members.filter(member => {
            if (member.status == 'Dead' && member.officialRank.point < 13) {
                return member;
            }
        });


        // Category wise approved count 
        const aliveOfficerApproved = totalAliveOfficerSent.filter(aliveOfficer => {
            return aliveOfficer.primarySelection.some(eventData => eventData.event == event && eventData.year == year && eventData.verificationStatus.status == 'Success')
        })
        const aliveORApproved = totalAliveORSent.filter(aliveOR => {
            return aliveOR.primarySelection.some(eventData => eventData.event == event && eventData.year == year && eventData.verificationStatus.status == 'Success')
        })
        const deadOfficerApproved = totalDeadOfficerSent.filter(deadOfficer => {
            return deadOfficer.primarySelection.some(eventData => eventData.event == event && eventData.year == year && eventData.verificationStatus.status == 'Success')
        })
        const deadORApproved = totalDeadORSent.filter(deadOR => {
            return deadOR.primarySelection.some(eventData => eventData.event == event && eventData.year == year && eventData.verificationStatus.status == 'Success')
        })

        // const aliveORApproved = totalAliveORSent.filter(aliveOR => {
        //     if (aliveOR.primarySelection.verificationStatus.status == 'Success') {
        //         return aliveOR
        //     }
        // })
        // const deadOfficerApproved = totalDeadOfficerSent.filter(deadOfficer => {
        //     if (deadOfficer.primarySelection.verificationStatus.status == 'Success') {
        //         return deadOfficer
        //     }
        // })
        // const deadORApproved = totalDeadORSent.filter(deadOR => {
        //     if (deadOR.primarySelection.verificationStatus.status == 'Success') {
        //         return deadOR
        //     }
        // })


        // console.log('Alive Officer:', totalAliveOfficerSent);
        let forceData = {
            force: force._id,
            totalAliveOfficer: totalAliveOfficerSent.length,
            // totalAliveOfficerApproved: totalAliveOfficerApproved.length,
            // totalAliveOfficerReject: totalAliveOfficerSent.length - totalAliveOfficerApproved.length,
            totalAliveOR: totalAliveORSent.length,
            totalDeadOfficer: totalDeadOfficerSent.length,
            totalDeadOR: totalDeadORSent.length,
            aliveOfficerApproved: aliveOfficerApproved.length,
            aliveORApproved: aliveORApproved.length,
            deadOfficerApproved: deadOfficerApproved.length,
            deadORApproved: deadORApproved.length
        }
        // console.log('forceData:', forceData);
        currentReport.push(forceData)

    })
    // console.log('forceData:', reportData);

    // previous year report calculation 
    const previousYearInvitees = await FreedomFighter.aggregate([
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
    console.log('previous year invited: ', previousYearInvitees.length);

    previousYearInvitees.map(force => {
        const totalAliveOfficerSent = force.members.filter(member => {
            if (member.status == 'Alive' && member.officialRank.point > 13) {
                return member;
            }
            // console.log(member);
        });
        const totalAliveORSent = force.members.filter(member => {
            if (member.status == 'Alive' && member.officialRank.point < 13) {
                return member;
            }
        });
        const totalDeadOfficerSent = force.members.filter(member => {
            if (member.status == 'Dead' && member.officialRank.point > 13) {
                return member;
            }
        });
        const totalDeadORSent = force.members.filter(member => {
            if (member.status == 'Dead' && member.officialRank.point < 13) {
                return member;
            }
        });


        // Category wise approved count 
        const aliveOfficerApproved = totalAliveOfficerSent.filter(aliveOfficer => {
            return aliveOfficer.primarySelection.some(eventData => eventData.event == event && eventData.year == (year - 1) && eventData.verificationStatus.status == 'Success')
        })
        const aliveORApproved = totalAliveORSent.filter(aliveOR => {
            return aliveOR.primarySelection.some(eventData => eventData.event == event && eventData.year == (year - 1) && eventData.verificationStatus.status == 'Success')
        })
        const deadOfficerApproved = totalDeadOfficerSent.filter(deadOfficer => {
            return deadOfficer.primarySelection.some(eventData => eventData.event == event && eventData.year == (year - 1) && eventData.verificationStatus.status == 'Success')
        })
        const deadORApproved = totalDeadORSent.filter(deadOR => {
            return deadOR.primarySelection.some(eventData => eventData.event == event && eventData.year == (year - 1) && eventData.verificationStatus.status == 'Success')
        })

        let forceData = {
            force: force._id,
            totalAliveOfficer: totalAliveOfficerSent.length,
            totalAliveOR: totalAliveORSent.length,
            totalDeadOfficer: totalDeadOfficerSent.length,
            totalDeadOR: totalDeadORSent.length,
            aliveOfficerApproved: aliveOfficerApproved.length,
            aliveORApproved: aliveORApproved.length,
            deadOfficerApproved: deadOfficerApproved.length,
            deadORApproved: deadORApproved.length
        }
        previousYearReport.push(forceData)
    })

    const fullReport = { currentReport, previousYearReport }
    return fullReport;

}