const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { generateInvitationCard } = require('../utils/generateInvitationCard');

const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH2_CLIENT_ID,
    process.env.OAUTH2_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
)

oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH2_REFRESH_TOKEN });

module.exports.sendMailWithGmail = async ({ mailInfo, qrCodeData }) => {

    const oAuth2AccessToken = await oAuth2Client.getAccessToken();
    const invitationCard = await generateInvitationCard(qrCodeData)

    // console.log('from gmail service', data);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.SENDER_MAIL,
            clientId: process.env.OAUTH2_CLIENT_ID,
            clientSecret: process.env.OAUTH2_CLIENT_SECRET,
            refreshToken: process.env.OAUTH2_REFRESH_TOKEN,
            accessToken: oAuth2AccessToken,
        },
    })
    const mailData = {
        from: process.env.SENDER_MAIL,
        to: mailInfo.to,
        subject: mailInfo.subject,
        text: `Dear ${qrCodeData.memberName}, 
                ${mailInfo.text}`,
        // attachments: data.attachments
        attachments: [
            {
                filename: 'invitation-card.png',
                content: invitationCard,
            },
        ],
    }

    // console.log(mailData);

    const info = await transporter.sendMail(mailData);

    console.log("Message sent %s", info.messageId);
    // console.log(info);

    return info;
}