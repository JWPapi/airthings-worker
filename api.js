const axios = require('axios');
const { log } = require('./logger');

async function getLatestSamples(token, serialNumber) {
    try {
        const response = await axios.get(
            `https://ext-api.airthings.com/v1/devices/${serialNumber}/latest-samples`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        log(`Error getting samples: ${error.message}`);
        throw error;
    }
}

module.exports = { getLatestSamples };
