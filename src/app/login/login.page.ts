import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  email: string = "";
  password: string = "";

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public toastCtrl: ToastController
    ) { }

  ngOnInit() {
 
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
    });
  }
 
  login() {
    console.log(this.email + ' ' + this.password);
    var value = { "email": this.email, "password": this.password };
    var photoURL = "";
    this.authService.loginUser(value).then(
      (res) => {
        console.log(res);

        this.toastCtrl.create({
          message: "Hi there " + res.user.displayName,
          duration: 3000
        }).then((toastData)=>{
          console.log(toastData);
          toastData.present();
        });

        this.navCtrl.navigateRoot('/feed');

      }).catch((err) => {
        console.log(err);

        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).then((toastData)=>{
          console.log(toastData);
          toastData.present();
        });

      })
  }
 
  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  gotoSignup(){
    this.navCtrl.navigateRoot('/signup');
  }

}
