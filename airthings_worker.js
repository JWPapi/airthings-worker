require('dotenv').config();
const { log } = require('./logger');
const { checkToken } = require('./token');

async function startWorker() {
    if (!process.env.AIRTHINGS_CLIENT_ID || !process.env.AIRTHINGS_SECRET) {
        log('Missing required environment variables!');
        process.exit(1);
    }

    log('Starting Airthings worker...');

    while (true) {
        try {
            const token = await checkToken();

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

startWorker().catch(error => {
    log(`Fatal error: ${error.message}`);
    process.exit(1);
});
