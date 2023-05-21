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

    const reportData = [];
    result.map(force => {
        // console.log(force._id);
        // console.log(force.members.length);
        // const forceData = {};
        const totalAliveOfficerSent = force.members.filter(member => {
            if (member.status == 'Alive' && member.officialRank.point > 13) {
                return member;
            }
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
        // console.log('Alive Officer:', totalAliveOfficerSent);
        let forceData = {
            force: force._id,
            totalAliveOfficer: totalAliveOfficerSent.length,
            totalAliveOR: totalAliveORSent.length,
            totalDeadOfficer: totalDeadOfficerSent.length,
            totalDeadOR: totalDeadORSent.length
        }
        console.log('forceData:', forceData);
        reportData.push(forceData)

    })
    console.log('forceData:', forceData);

    return result;

}