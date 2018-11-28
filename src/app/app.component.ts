import { Component } from "@angular/core";
import { Platform, ToastController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Firebase } from "@ionic-native/firebase";
import { Push, PushObject, PushOptions } from "@ionic-native/push";

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
    private push: Push
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.firebase
        .getToken()
        .then(token => {
          let toast = this.toastCtrl.create({
            message: `The token is ${token}`,
            showCloseButton: true,
            closeButtonText: "Ok"
          });
          toast.present();
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
    });
  }
}
