const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

exports.pushes = functions.firestore
    .document('notifications/{token}')
    .onCreate((snap, context) => {
        const document = snap.data();
        console.log('document is', document);

        const registrationToken = context.params.token;
        const message = {
          data: {
            title: document.fromName,
            body: document.text,
            sender: document.fromId
          },
          token: registrationToken
        }

        admin.messaging().send(message)
          .then((response) => {
            console.log('Successfully sent message: ' , response);
          })
          .catch((error) => {
            console.log('Error sending message: ', error);
          })

        admin.firestore().collection('notifications')
          .doc(registrationToken)
          .delete();

        return Promise.resolve(0);
    })
