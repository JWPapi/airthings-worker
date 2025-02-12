const Push = require('pushover-notifications');
const { log } = require('./logger');

const push = new Push({
    user: process.env.PUSHOVER_USER_KEY,
    token: process.env.PUSHOVER_APP_TOKEN
});

function sendNotification(title, message) {
    push.send({
        title: title,
        message: message,
        priority: 1
    }, function(err, result) {
        if (err) {
            log(`Failed to send notification: ${err}`);
        }
    });
}

module.exports = { sendNotification };
