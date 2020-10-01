const functions = require('firebase-functions');

// firebase admin library
const admin = require('firebase-admin')
admin.initializeApp()

exports.checkAlias = functions.https.onCall((data, context) => { // calling that from the front end

    // sending slug property on the data object
    const ref = admin.firestore().collection('users').doc(data.slug);
    return ref.get().then(doc => {
        // if doc exists, it will be true, then it wont be unique
        return { unique: !doc.exists }
    }).catch(err => {
        throw new functions.https.HttpsError('failed to connect')
    })
})