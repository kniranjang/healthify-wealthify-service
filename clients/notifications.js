var azure = require('azure-sb');
var DataClient = require('./file_Client');
var dataClient = new DataClient();
var datetime = require('date-and-time');
var CronJob = require('cron').CronJob;
var schedule = new CronJob('00 00 07 * * *',
    () => {
        sendNotification();
    }, null, true, 'UTC');
var notificationHubService = azure.createNotificationHubService('healthifywealthify', 'Endpoint=sb://healthifywealthify.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=pk3TNQoV2wPWnPgC1at41XSFKlCHkZUWFru31uIT5Rw=');

function sendNotification() {
    var arr = dataClient.getAllUsers();
    var today = new Date();
    today = datetime.addDays(today, -1);
    arr = arr.filter(element =>
        datetime.isSameDay(today, element.nextCheckupDate)
    );
    var payload = {
        data: {
            message: 'Reminder! You have your checkup tomorrow!'
        }
    };
    arr.forEach(element => {
        notificationHubService.gcm.send(element.id, payload, function (error) {
            if (!error) {
                //notification sent
            }
        });
    });

}

module.exports = {
    sendAllNotifications: function sendAllNotifications(message) {
        var payload = {
            data: {
                message: message
            }
        };
        // console.log(payload.data.message);
        notificationHubService.gcm.send(null, payload, function (error) {
            if (error) {
                return "error"; 
            } else {
                console.log(payload.data.message);
            }
        });

    }
}

