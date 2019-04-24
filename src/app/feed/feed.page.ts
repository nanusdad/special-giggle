import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { DatastorageService } from '../services/datastorage.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  postText: string = "";
  posts: any[] = [];

  constructor(
    private datastorageService: DatastorageService,
    public navCtrl: NavController,
    public toastCtrl: ToastController
  ) {

    this.getPosts();

  }

  ngOnInit() {
  }

  getPosts() {

    this.posts = [];

    this.datastorageService.datastoreGet("posts")
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        console.log(this.posts);

      }).catch((err) => {
        console.log(err);

        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).then((toastData)=>{
          console.log(toastData);
          toastData.present();
        });

        this.navCtrl.navigateBack('/home');
      })

  }
  post() {
    var rec = {
      postText: this.postText,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    };

    this.datastorageService.datastoreAdd("posts", rec)
      .then((doc) => {
        console.log(doc);
        this.getPosts();
      }).catch((err) => {
        console.log(err);
      })

  }

  delete(docId) {

    console.log('Attempting to delete ' + docId);

    this.datastorageService.datastoreDelete("posts", docId)
      .then((doc) => {
        console.log(doc);
        this.getPosts();
      }).catch((err) => {
        console.log(err);
      })

  }

}
