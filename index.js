require('dotenv').config();
const { log } = require('./logger');
const { checkToken } = require('./token');
const { getLatestSamples } = require('./api');
const { sendNotification } = require('./notifications');

async function startWorker() {
    if (!process.env.AIRTHINGS_CLIENT_ID || !process.env.AIRTHINGS_SECRET || 
        !process.env.AIRTHINGS_SERIAL_NIMBER || !process.env.PUSHOVER_USER_KEY || 
        !process.env.PUSHOVER_APP_TOKEN) {
        log('Missing required environment variables!');
        process.exit(1);
    }

    log('Starting Airthings worker...');
    sendNotification('Airthings Monitor', 'Worker started monitoring air quality');

    while (true) {
        try {
            const token = await checkToken();
            
            // Get latest samples from the device
            const data = await getLatestSamples(token, process.env.AIRTHINGS_SERIAL_NIMBER);
            log('Latest samples:');
            log(JSON.stringify(data, null, 2));

            // Send notification if CO2 is too high
            if (data.data.co2 > 1000) {
                sendNotification('High CO2 Alert', `CO2 level is ${data.data.co2} ppm!`);
            }

            await new Promise(resolve => setTimeout(resolve, 15 * 60 * 1000));

        } catch (error) {
            log(`Error: ${error.message}`);
            sendNotification('Airthings Error', error.message);
            // Wait 1 minute before retry on error
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
}

startWorker().catch(error => {
    log(`Fatal error: ${error.message}`);
    sendNotification('Airthings Fatal Error', error.message);
    process.exit(1);
});
