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

  datastoreAdd(collectionName: string, value: object) {

    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection(collectionName).add(value)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  datastoreGet(collectionName: string, orderByField: string, orderByDirection: any, limitSize: number, startAfter: any) {

    if (startAfter != null) {


      return new Promise<any>((resolve, reject) => {
        firebase.firestore().collection(collectionName).orderBy(orderByField, orderByDirection).startAfter(startAfter).limit(limitSize).get()
          .then(
            res => resolve(res),
            err => reject(err))
      })

    } else {

      return new Promise<any>((resolve, reject) => {
        firebase.firestore().collection(collectionName).orderBy(orderByField, orderByDirection).limit(limitSize).get()
          .then(
            res => resolve(res),
            err => reject(err))
      })

    }
  }

  datastoreSnapshot(collectionName: string, orderByField: string, orderByDirection: any, limitSize: number, startAfter?: any) {

    if (startAfter != null) {
      return firebase.firestore().collection(collectionName).orderBy(orderByField, orderByDirection).startAfter(startAfter).limit(limitSize);
    } else {
      return firebase.firestore().collection(collectionName).orderBy(orderByField, orderByDirection).limit(limitSize);
    }
  }

  datastoreDelete(collectionName: string, docId) {

    return new Promise<any>((resolve, reject) => {
      firebase.firestore().collection(collectionName).doc(docId).delete()
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }
}
