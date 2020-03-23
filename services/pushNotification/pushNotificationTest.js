var mobileNotification = require('./fcm');
var deviceIds = ['eatU41SSjlo:APA91bFK9LzvTN88cuw0NJd0wsVjJXEyrCa9PHMMK8DUQO7Ks90Ph95P-w1ClgHrDrRULuqCcMeS5oXZ_DQEqMHvG_sZuIcJiPUoBxj7UL7bLXjxuoD3dOouKu4b4AHz3UG3nxv9MTg-']
var message = {
    deviceIds: deviceIds,
    userId: 533,
    name: 'Vivek',
    body: 'Test2 notification?',
    texName:'',
    textMessage:'Test2 notification?'
};
mobileNotification.sendNotification(message);