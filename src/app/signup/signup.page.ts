import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
  constructor(public navCtrl: NavController, private authService: AuthenticationService) {
    
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
        console.log(user)
        this.authService.updateUser(user,this.name, photoURL).then(
          (res) => {
            console.log('Profile Updated');
          })

      }).catch((err) => {
        console.log(err)
      })
  }

  ngOnInit() {
  }

}
