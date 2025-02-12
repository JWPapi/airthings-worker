require('dotenv').config();
const axios = require('axios');

// Setup logging
const logger = {
    info: (msg) => console.log(`${new Date().toISOString()} - INFO - ${msg}`),
    error: (msg) => console.error(`${new Date().toISOString()} - ERROR - ${msg}`)
};

class AirthingsWorker {
    constructor() {
        this.clientId = process.env.AIRTHINGS_CLIENT_ID;
        this.clientSecret = process.env.AIRTHINGS_SECRET;
        this.serialNumber = process.env.AIRTHINGS_SERIAL_NIMBER;
        this.token = null;
        this.tokenExpiresAt = null;

        if (!this.clientId || !this.clientSecret || !this.serialNumber) {
            throw new Error("Missing required environment variables");
        }
    }

    async getToken() {
        const url = "https://accounts-api.airthings.com/v1/token";
        const payload = {
            grant_type: "client_credentials",
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: ["read:device:current_values"]
        };

        try {
            const response = await axios.post(url, payload);
            this.token = response.data.access_token;
            // Set expiration time (subtract 5 minutes for safety margin)
            this.tokenExpiresAt = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
            logger.info("Successfully obtained new access token");
        } catch (error) {
            logger.error(`Failed to get token: ${error.message}`);
            throw error;
        }
    }

    async ensureValidToken() {
        if (!this.token || !this.tokenExpiresAt || new Date() >= this.tokenExpiresAt) {
            await this.getToken();
        }
    }

    async run() {
        logger.info("Starting Airthings worker...");

        while (true) {
            try {
                await this.ensureValidToken();
                logger.info(`Token valid until: ${this.tokenExpiresAt}`);

                // Here you can add your actual work with the API
                // For example, getting device readings, etc.

                // Sleep for 5 minutes before next check
                await new Promise(resolve => setTimeout(resolve, 300000));

            } catch (error) {
                logger.error(`Error in worker loop: ${error.message}`);
                // Sleep for 1 minute before retry on error
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        }
    }
}

if (require.main === module) {
    const worker = new AirthingsWorker();
    worker.run().catch(error => {
        logger.error(`Fatal error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = AirthingsWorker;
