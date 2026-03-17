//const Config = use('Config')
//const FIREBASE_SERVICE_ACCOUNT_KEY = Config.get('app.FIREBASE_SERVICE_ACCOUNT_KEY')

var admin = require("firebase-admin");
//const  {  GeoFire } = require('geofire');
//var serviceAccount = require('../../firebase-adminsdk.json')

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

var default_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

class Firebase {
  constructor() {
    this.Utils = use("Utils");
    this.Env = use("Env");
    const firebase_path = this.Env.get("FIREBASE_PATH", "NO_FIREBASE_PATH");
    if (firebase_path != "NO_FIREBASE_PATH") {
      if (!admin.apps.length) {
        var serviceAccount = require(firebase_path);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: this.Env.get("DATABASE_URL"),
        });
      }
    }
  }
  async sendMessage(payload) {
    try {
      this.Utils.Logger({
        LVL: "info",
        MODULE: "Firebase",
        FUNC: "sendMessage",
        CONTENT:
          "token:" + payload.token + ", payload:" + JSON.stringify(payload),
      });
      const response = await admin.messaging().send(payload);
      if (response) {
        this.Utils.Logger({
          LVL: "info",
          MODULE: "Firebase",
          FUNC: "sendMessage",
          CONTENT: JSON.stringify(response),
        });
        return response;
      } else {
        this.Utils.Logger({
          LVL: "error",
          MODULE: "Firebase",
          FUNC: "sendMessage",
          CONTENT: JSON.stringify(response),
        });
        return null;
      }
    } catch (e) {
      this.Utils.Logger({
        LVL: "error",
        MODULE: "Firebase",
        FUNC: "sendMessage",
        CONTENT: JSON.stringify(e.message),
      });
      return "sendMessage error: " + e;
    }
  }
  async sendToDevice(registrationToken, payload, options) {
    try {
      if (options == null) {
        options = default_options;
      }
      this.Utils.Logger({
        LVL: "info",
        MODULE: "Firebase",
        FUNC: "sendToDevice",
        CONTENT:
          "token:" + registrationToken + ",payload:" + JSON.stringify(payload),
      });
      let utils = this.Utils;

      await admin
        .messaging()
        .sendToDevice(registrationToken, payload, options)
        .then(function (response) {
          const error = response.results[0].error;
          if (error) {
            if (
              error.code == "messaging/registration-token-not-registered" ||
              error.code != null
            ) {
              utils.Logger({
                LVL: "error",
                MODULE: "Firebase",
                FUNC: "sendToDevice",
                CONTENT: error.message,
              });
            }
            console.log(error);
          } else {
            utils.Logger({
              LVL: "info",
              MODULE: "Firebase",
              FUNC: "sendToDevice",
              CONTENT: JSON.stringify(response),
            });
          }
        })
        .catch(function (error) {
          utils.Logger({
            LVL: "error",
            MODULE: "Firebase",
            FUNC: "sendToDevice",
            CONTENT: JSON.stringify(error),
          });
        });
      return "Success";
    } catch (e) {
      this.Utils.Logger({
        LVL: "error",
        MODULE: "Firebase",
        FUNC: "sendToDevice",
        CONTENT: e.message,
      });
      return "Message sent error: " + e;
    }
  }
  async sendToTopic(topic, payload, options) {
    try {
      if (options == null) {
        options = default_options;
      }
      await admin.messaging().sendToTopic(topic, payload, options);
      return "Success";
    } catch (e) {
      return "Message sent error: " + e;
    }
  }
  async subscribeToTopic(registrationTokens, topic) {
    try {
      await admin.messaging().subscribeToTopic(registrationTokens, topic);
      return "Success";
    } catch (e) {
      return "subscribeToTopic error: " + e;
    }
  }
  async writeRTDB(p_node, p_data) {
    try {
      const newKey = admin.database().ref().child(p_node).push().key;
      let updates = {};
      updates[`/${p_node}/` + newKey] = p_data;
      return await admin.database().ref().update(updates);
      return "OK";
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }
  async updateRTDB(p_node, p_data) {
    try {
      if (p_data.id) {
        return await admin
          .database()
          .ref(`/${p_node}/` + p_data.id)
          .set(p_data);
      } else {
        const newKey = admin.database().ref().child(p_node).push().key;
        return await admin
          .database()
          .ref(`/${p_node}/` + newKey)
          .set(p_data);
      }
      return "OK";
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }
  /*async getDrivers(p_location, p_radius) {
              try {
                  let drivers = [];
                  let drivers_distance = [];

                  const refDrivers = admin.database().ref("/drivers")
                  const geoFireDrivers = new GeoFire(refDrivers);
                  const geoQuery = geoFireDrivers.query({ center: p_location, radius: p_radius })

                  const onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
                      // console.log(distance)
                      // console.log(key + " entered the query. Hi " + location + "!")
                      drivers.push(key)
                      drivers_distance.push({ id: key, distance: Math.ceil(distance) })
                  })

                  const onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location) {
                      // console.log(key + " migrated out of the query. Bye bye :(")
                      let removeIndex = drivers.findIndex(x => x == key)
                      let removeDriver = drivers_distance.findIndex(y => y.id == key)
                      drivers.splice(removeIndex, 1)
                      drivers_distance.splice(removeDriver, 1)

                  });
                  let count = 0
                  while (drivers.length == 0 && count < 4) {
                      count++
                      //console.log("wait1... "+count) 
                      await this._sleep(1);
                      //console.log("wait...end")
                  }

                  return { drivers: drivers, distance: drivers_distance }
              } catch (e) {
                  console.log("Message sent error: " + e)
                  return null
              }
          }*/
  _sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
module.exports = Firebase;
