import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  name: string = "";
  email: string = "";
  password: string = "";

  // constructor(public navCtrl: NavController, public afAuth: AngularFireAuth){
  constructor(
    public navCtrl: NavController,
    private authService: AuthenticationService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) {

  }

  gotoLogin() {
    this.navCtrl.navigateBack('/home');
  }

  signup() {
    console.log(this.name + ' ' + this.email + ' ' + this.password);
    var value = { "email": this.email, "password": this.password };
    var photoURL = "";
    this.authService.registerUser(value).then(
      (user) => {
        console.log(user);

        this.toastCtrl.create({
          message: "Hi there, " + this.name + '. Thanks for signing up.',
          duration: 3000
        }).then((toastData) => {
          console.log(toastData);
          toastData.present();
        });


        this.authService.updateUser(user, this.name, photoURL).then(
          (res) => {
            console.log('Profile Updated');
            this.alertCtrl.create({
              header: 'Account Created',
              message: "Your account has been successfully created",
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    //Navigate to the feeds page
                    console.log('Navigate to feed page')
                  }
                }
              ]
            }).then((alertData) => {
                console.log(alertData);
                alertData.present();
            });
          })

      }).catch((err) => {
        console.log(err);

        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).then((toastData) => {
          console.log(toastData);
          toastData.present();
        });
      })
  }

  ngOnInit() {
  }

}
