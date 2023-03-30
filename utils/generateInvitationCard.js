const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');

exports.generateInvitationCard = async (name, email) => {
    // Load background image
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    // console.log('ctx');
    // const backgroundImage = await loadImage(`F:\Projects\freedom-fighter-db-bank\freedom-fighter-db-bank-server\bgImage.png`);
    // ctx.drawImage(canvas.width, canvas.height);

    // Set the background color to red
    ctx.fillStyle = 'white';

    // Fill the entire canvas with the background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text to the image
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Dear ${name},`, 100, 200);

    ctx.font = 'bold 48px Arial';
    ctx.fillText('You are invited to our party!', 100, 300);

    // Generate QR code
    const qrCodeData = { name, email };
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrCodeData));

    // Load QR code image and draw on canvas
    const qrCodeImg = await loadImage(qrCodeImage);
    ctx.drawImage(qrCodeImg, 500, 350, 200, 200);

    // Save canvas as PNG image
    const buffer = canvas.toBuffer('image/png');

    return buffer;
}
