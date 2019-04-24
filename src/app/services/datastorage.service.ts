import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

// Not required in Firestore (5.9.4)
// firebase.firestore().settings({
//   timestampsInSnapshots: true
// })

@Injectable({
  providedIn: 'root'
})
export class DatastorageService {

  constructor() { }

  datastoreAdd(collectionName, value) {

    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection(collectionName).add(value)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  datastoreGet(collectionName) {

    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection(collectionName).orderBy("created", "desc").get()
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  datastoreDelete(collectionName, docId) {

    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection(collectionName).doc(docId).delete()
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }
}
