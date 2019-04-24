import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {

  constructor() { }

  registerUser(value) {

    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
          .then(() => {
            console.log("LOG Out");
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    })
  }

  userDetails() {
    return firebase.auth().currentUser;
  }

  updateUser(data, userName, photoURL) {
      let userToUpdate: firebase.User = data.user
      return (userToUpdate.updateProfile({
        displayName: userName,
        photoURL: photoURL
      }));
    }
}
