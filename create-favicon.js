const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createCircularFavicon() {
    const inputPath = path.join(__dirname, 'public', 'LOGO_TRA_DA_DATA.jpg');
    const outputPath = path.join(__dirname, 'src', 'app', 'favicon.ico');

    const size = 256;

    // Create circular mask SVG with RGBA (4 channels)
    const maskSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="black"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`;

    // Convert mask to grayscale single-channel
    const maskBuffer = await sharp(Buffer.from(maskSvg))
        .resize(size, size)
        .greyscale()
        .toFormat('raw')
        .toBuffer();

    // Resize source to square
    const squareBuffer = await sharp(inputPath)
        .resize(size, size, { fit: 'cover', position: 'center' })
        .ensureAlpha()
        .toFormat('raw')
        .toBuffer();

    // Manually apply mask: for each pixel, multiply alpha by mask value
    const pixelCount = size * size;
    for (let i = 0; i < pixelCount; i++) {
        const maskVal = maskBuffer[i] / 255.0;
        squareBuffer[i * 4 + 3] = Math.round(squareBuffer[i * 4 + 3] * maskVal);
    }

    // Convert back to PNG, resize to favicon
    const circularImage = await sharp(squareBuffer, {
        raw: { width: size, height: size, channels: 4 }
    })
        .resize(64, 64)
        .png()
        .toBuffer();

    fs.writeFileSync(outputPath, circularImage);
    console.log('✅ Circular favicon created at:', outputPath);
}

createCircularFavicon().catch(console.error);
