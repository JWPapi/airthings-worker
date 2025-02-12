require('dotenv').config();
const axios = require('axios');

// Global variables for token management
let token = null;
let tokenExpiresAt = null;

// Simple logging
function log(msg) {
    console.log(`${new Date().toISOString()} - ${msg}`);
}

// Get a new token from Airthings API
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
        // Set expiration time (subtract 5 minutes for safety margin)
        tokenExpiresAt = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
        log(`Got new token, valid until ${tokenExpiresAt}`);
    } catch (error) {
        log(`Error getting token: ${error.message}`);
        throw error;
    }
}

// Check and refresh token if needed
async function checkToken() {
    if (!token || !tokenExpiresAt || new Date() >= tokenExpiresAt) {
        await getToken();
    }
}

// Main worker function
async function startWorker() {
    // Check environment variables
    if (!process.env.AIRTHINGS_CLIENT_ID || !process.env.AIRTHINGS_SECRET) {
        log('Missing required environment variables!');
        process.exit(1);
    }

    log('Starting Airthings worker...');

    while (true) {
        try {
            await checkToken();

            // Here you can add your actual work with the API
            // For example, getting device readings, etc.

            // Wait 5 minutes before next check
            await new Promise(resolve => setTimeout(resolve, 300000));

        } catch (error) {
            log(`Error: ${error.message}`);
            // Wait 1 minute before retry on error
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
}

// Start the worker
startWorker().catch(error => {
    log(`Fatal error: ${error.message}`);
    process.exit(1);
});
