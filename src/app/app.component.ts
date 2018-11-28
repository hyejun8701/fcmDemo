import { Component } from "@angular/core";
import { Platform, ToastController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Firebase } from "@ionic-native/firebase";
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { UniqueDeviceID } from "@ionic-native/unique-device-id";
import { FCM } from "fcm-node";

import { HomePage } from "../pages/home/home";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private firebase: Firebase,
    private toastCtrl: ToastController,
    private push: Push,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.firebase
        .getToken()
        .then(token => {
          // let toast = this.toastCtrl.create({
          //   message: `${token}`,
          //   showCloseButton: true,
          //   closeButtonText: "Ok"
          // });
          // toast.present();
          alert(`${token}`);
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error("Error getting token", error));

      this.firebase
        .onTokenRefresh()
        .subscribe((token: string) => console.log(`Got a new token ${token}`));

      // this.firebase.onNotificationOpen().subscribe(res => {
      //   alert(res);
      // });

      this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          alert("We have permission to send push notifications");
        } else {
          alert("We do not have permission to send push notifications");
        }
      });

      const options: PushOptions = {
        android: {
          icon: "phonegap"
        },
        ios: {
          alert: "true",
          badge: true,
          sound: "false"
        },
        windows: {},
        browser: {
          pushServiceURL: "http://push.api.phonegap.com/v1/push"
        }
      };

      // pushObject.on('')

      const pushObject: PushObject = this.push.init(options);

      pushObject
        .on("notification")
        .subscribe((notification: any) =>
          alert("Received a notification" + JSON.stringify(notification))
        );

      pushObject
        .on("registration")
        .subscribe((registration: any) =>
          alert("Device registered" + JSON.stringify(registration))
        );

      pushObject
        .on("error")
        .subscribe(error => alert("Error with Push plugin" + error));

      //const FCM = require("fcm-node");
      // Replace these with your own values.
      const apiKey = "AIzaSyDB1hnDpcZfVe6MTknUYDOm-7wJxjqkc80";
      let deviceID = "";
      const fcm = new FCM(apiKey);

      this.uniqueDeviceID
        .get()
        .then((uuid: any) => {
          alert(uuid);
          deviceID = uuid;
        })
        .catch((error: any) => alert(error));

      const message = {
        to: deviceID,
        data: {
          title: "Big Picture",
          message: "This is my big picture message",
          picture:
            "http://36.media.tumblr.com/c066cc2238103856c9ac506faa6f3bc2/tumblr_nmstmqtuo81tssmyno1_1280.jpg",
          summaryText: "The internet is built on cat pictures"
        }
      };

      fcm.send(message, (err, response) => {
        if (err) {
          console.log(err);
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
    });
  }
}
