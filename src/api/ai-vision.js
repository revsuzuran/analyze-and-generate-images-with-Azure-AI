// const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');

const endpoint = process.env.REACT_APP_VISION_ENDPOINT || '';
const key = process.env.REACT_APP_VISION_KEY || '';

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);
const features = [
    'Caption',
    'DenseCaptions',
    'Objects',
    'People',
    'Read',
    'SmartCrops',
    'Tags'
];

async function processImage(imgUrl) {
    return await client.path('/imageanalysis:analyze').post({
        body: {
            url: imgUrl
        },
        queryParameters: {
            features: features,
            'language': 'en',
            'gender-neutral-captions': 'true',
            'smartCrops-aspect-ratios': [0.9, 1.33]
        },
        contentType: 'application/json'
    });
}

module.exports = {
    processImage
}

