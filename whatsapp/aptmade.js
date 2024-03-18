const accountSid = process.env.ACCOUNTSID
const authToken = process.env.AUTHTOKEN
const client = require('twilio')(accountSid, authToken);

function sendAppointmentCreatedMessage(dateAndTime, phone){
    client.messages
        .create({
            messagingServiceSid: 'MGf95103e4cda1035962adcfc275e47d7d',
            contentSid: 'HX444e87f5b0fa719e7a4ac9bf9af8f0d3',
            from: 'whatsapp:+18777310396',
            contentVariables: JSON.stringify({
                1: dateAndTime,
                2: ''
            }),
            to:  `whatsapp:${phone}`
        })
        .then(message => console.log(message.sid));
}

export default sendAppointmentCreatedMessage