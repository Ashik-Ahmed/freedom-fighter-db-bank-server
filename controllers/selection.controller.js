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
        const { memberId, memberName, eventToBeUpdate, mailData } = req.body;
        // console.log(memberId, eventToBeUpdate, mailData);
        const qrCodeData = {
            memberName,
            event: eventToBeUpdate.name,
            year: eventToBeUpdate.year,
        }


        QRCode.toBuffer(JSON.stringify(qrCodeData), { type: 'png' }, function (err, buffer) {
            if (err) {
                res.status(400).send('QR Code generation failed');
                console.log(err)
                return;
            }

            mailData.attachments = [
                {
                    filename: 'qr-code.png',
                    content: buffer,
                    contentType: 'image/png'
                }
            ];
            // Printing the code
            // console.log(mailData)
        })

        // console.log(mailData);

        // QRCode.toFile('myQrCode.png', JSON.stringify(qrCodeData), {
        //     type: 'png',
        //     errorCorrectionLevel: 'H',
        //     margin: 1,
        //     scale: 8
        // }, (err) => {
        //     if (err) throw err;
        //     console.log('QR code generated');
        // });


        const emailSend = await sendMailWithGmail(mailData)
        // console.log('emailsend Data', emailSend);

        if (emailSend.messageId) {
            const updateData = {
                memberId,
                eventToBeUpdate,
                invitationMail: 'Sent'
            }
            const result = await sendInvitationMailService(updateData);
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