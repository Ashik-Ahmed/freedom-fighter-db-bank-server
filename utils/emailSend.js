const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH2_CLIENT_ID,
    process.env.OAUTH2_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
)

oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH2_REFRESH_TOKEN });

module.exports.sendMailWithGmail = async (data) => {
    const oAuth2AccessToken = await oAuth2Client.getAccessToken();

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
        to: data.to,
        subject: data.subject,
        text: data.text
    }

    console.log(mailData);

    const info = await transporter.sendMail(mailData);

    console.log("Message sent %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info.messageId;
}