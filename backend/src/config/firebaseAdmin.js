const admin = require("firebase-admin");
const serviceAccount = require("../qchat-5454-firebase-adminsdk-fbsvc-60262bab2c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;