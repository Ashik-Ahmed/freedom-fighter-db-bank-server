const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');

exports.generateInvitationCard = async (data) => {

    // const { invitationText } = data;
    const { invitationText, ...qrCodeData } = data
    const { memberName } = qrCodeData
    // Load background image
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    // const backgroundImage = await loadImage(`F:\Projects\freedom-fighter-db-bank\freedom-fighter-db-bank-server\bgImage.png`);
    // ctx.drawImage(canvas.width, canvas.height);

    // Set the background color to red
    ctx.fillStyle = '#FF5733';

    // Fill the entire canvas with the background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text to the image
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Invitation Card`, 250, 50);

    // ctx.font = 'bold 52px Arial';
    // ctx.fillStyle = '#000000';
    // ctx.fillText(`${event} - ${year}`, 100, 100);


    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Dear ${memberName},`, 50, 150);


    // Set the max text width
    const maxWidth = canvas.width - 10;

    // Split the text into multiple lines
    let words = data.invitationText.split(' ');
    let line = '';
    let lines = [];

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + ' ';
            console.log(testWidth);
            console.log(lines);
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    // console.log(lines);


    ctx.font = '16px Arial';
    // ctx.fillText(`${invitationText.replace('Dear Respected Member,')}`, 50, 170);
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 50, 190 + i * 25);
    }

    // Generate QR code
    // const qrCodeData = { name, email };
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrCodeData));

    // Load QR code image and draw on canvas
    const qrCodeImg = await loadImage(qrCodeImage);
    ctx.drawImage(qrCodeImg, 600, 400, 150, 150);


    ctx.font = '12px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Powered by Lamda Telecom', 600, 590);

    // Save canvas as PNG image
    const buffer = canvas.toBuffer('image/png');

    return buffer;
}
