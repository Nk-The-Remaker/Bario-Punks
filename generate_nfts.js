const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Define the dimensions of the NFT
const width = 1000;
const height = 1000;

// Get the list of files in a directory
const getFiles = (path) => fs.readdirSync(path).map(file => `${path}/${file}`);

// Load all assets
const backgrounds = getFiles('./assets/backgrounds');
const bodies = getFiles('./assets/bodies');
const accessories = getFiles('./assets/accessories');

// Function to pick a random item from an array
const randomPick = (array) => array[Math.floor(Math.random() * array.length)];

// Function to create a new NFT
const createNFT = async (id, variation) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Pick random elements
    const background = randomPick(backgrounds);
    const body = randomPick(bodies);
    const accessory = randomPick(accessories);

    // Load and draw each layer
    const bgImage = await loadImage(background);
    ctx.drawImage(bgImage, 0, 0, width, height);

    const bodyImage = await loadImage(body);
    ctx.drawImage(bodyImage, 0, 0, width, height);

    const accessoryImage = await loadImage(accessory);
    ctx.drawImage(accessoryImage, 0, 0, width, height);

    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./output/nft_${variation}_${id}.png`, buffer);

    // Create metadata
    const metadata = {
        name: `NFT #${variation}_${id}`,
        description: `This is NFT #${variation}_${id} from variation ${variation}`,
        image: `./output/nft_${variation}_${id}.png`,
        attributes: [
            { trait_type: 'Background', value: background.split('/').pop() },
            { trait_type: 'Body', value: body.split('/').pop() },
            { trait_type: 'Accessory', value: accessory.split('/').pop() },
        ]
    };
    fs.writeFileSync(`./output/nft_${variation}_${id}.json`, JSON.stringify(metadata, null, 2));
}

// Create multiple NFTs
const generateNFTs = async () => {
    const variations = 36;
    const totalSupply = 1002;
    const supplyPerVariation = Math.floor(totalSupply / variations);

    for (let variation = 1; variation <= variations; variation++) {
        for (let i = 1; i <= supplyPerVariation; i++) {
            await createNFT(i, variation);
        }
    }
}

// Generate the NFTs
generateNFTs();