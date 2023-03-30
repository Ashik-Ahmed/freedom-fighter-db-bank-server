const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');

exports.generateInvitationCard = async (qrCodeData) => {

    const { memberId, memberName, event, year } = qrCodeData;
    // Load background image
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    console.log('QR data: ', qrCodeData);
    // const backgroundImage = await loadImage(`F:\Projects\freedom-fighter-db-bank\freedom-fighter-db-bank-server\bgImage.png`);
    // ctx.drawImage(canvas.width, canvas.height);

    // Set the background color to red
    ctx.fillStyle = 'white';

    // Fill the entire canvas with the background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text to the image
    ctx.font = 'bold 52px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Invitation Card`, 100, 50);

    ctx.font = 'bold 52px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${event} - ${year}`, 100, 50);


    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Dear ${memberName},`, 100, 200);

    ctx.font = 'bold 16px Arial';
    ctx.fillText('You are invited to our party!', 100, 300);

    // Generate QR code
    // const qrCodeData = { name, email };
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrCodeData));

    // Load QR code image and draw on canvas
    const qrCodeImg = await loadImage(qrCodeImage);
    ctx.drawImage(qrCodeImg, 500, 350, 200, 200);

    // Save canvas as PNG image
    const buffer = canvas.toBuffer('image/png');

    return buffer;
}
