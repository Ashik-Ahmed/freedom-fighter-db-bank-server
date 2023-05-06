const { sendMailWithGmail } = require("../middleware/emailSend");
const FreedomFighter = require("../models/FreedomFighter");
const { getSelectedFreedomFightersService, updateTemporarySelectedMembersService, getPrimarySelectedMembersService, verificationUpdateService, deletePrimarySelectedMemberService, getFinalSelectedMembersService, sendInvitationMailService, } = require("../services/selection.service");
const QRCode = require('qrcode')

exports.selectFreedomFighters = async (req, res) => {
    try {
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