const axios = require('axios');
const { log } = require('./logger');

let token = null;
let tokenExpiresAt = null;

async function getToken() {
    const url = "https://accounts-api.airthings.com/v1/token";
    const payload = {
        grant_type: "client_credentials",
        client_id: process.env.AIRTHINGS_CLIENT_ID,
        client_secret: process.env.AIRTHINGS_SECRET,
        scope: ["read:device:current_values"]
    };

    try {
        const response = await axios.post(url, payload);
        token = response.data.access_token;
        tokenExpiresAt = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
        log(`Got new token, valid until ${tokenExpiresAt}`);
    } catch (error) {
        log(`Error getting token: ${error.message}`);
        throw error;
    }
}

async function checkToken() {
    if (!token || !tokenExpiresAt || new Date() >= tokenExpiresAt) {
        await getToken();
    }
    return token;
}

module.exports = { checkToken };
