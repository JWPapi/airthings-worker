require('dotenv').config();
const { log } = require('./logger');
const { checkToken } = require('./token');
const { getLatestSamples } = require('./api');

async function startWorker() {
    if (!process.env.AIRTHINGS_CLIENT_ID || !process.env.AIRTHINGS_SECRET || !process.env.AIRTHINGS_SERIAL_NIMBER) {
        log('Missing required environment variables!');
        process.exit(1);
    }

    log('Starting Airthings worker...');

    while (true) {
        try {
            const token = await checkToken();
            
            // Get latest samples from the device
            const data = await getLatestSamples(token, process.env.AIRTHINGS_SERIAL_NIMBER);
            log('Latest samples:');
            log(JSON.stringify(data, null, 2));

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
