import { Component, OnInit, ViewChild } from '@angular/core';


import { NavController, ToastController, IonInfiniteScroll } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { DatastorageService } from '../services/datastorage.service';
import * as moment from 'moment';
import { EventEmitter } from 'events';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  postText: string = "";
  posts: any[] = [];
  pageSize: number = 5;
  cursor: any;

  constructor(
    private datastorageService: DatastorageService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingService
  ) {

    this.getPosts();

  }

  ngOnInit() {
  }

  getPosts() {

    this.posts = [];


    this.loadingCtrl.present();


    let query = this.datastorageService.datastoreSnapshot("posts", "created", 'desc', this.pageSize, null);

    query.onSnapshot((snapshot) => {
      console.log("Changed");
      let changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
          console.log("Document with id " + change.doc.id + " has been " + change.type);
        }

        if (change.type == "modified") {
          // TODO
          console.log("Document with id " + change.doc.id + " has been " + change.type);
        }

        if (change.type == "removed") {
          // TODO
          console.log("Document with id " + change.doc.id + " has been " + change.type);
        }

      })
    })

    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        this.loadingCtrl.dismiss();

        this.cursor = this.posts[this.posts.length - 1];
        console.log(this.cursor);

        console.log(this.posts);

      }).catch((err) => {
        console.log(err);

        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).then((toastData) => {
          console.log(toastData);
          toastData.present();
        });

        this.navCtrl.navigateBack('/home');
      })

  }

  loadMorePosts(event) {

    this.datastorageService.datastoreGet("posts", "created", 'desc', this.pageSize, this.cursor)
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        console.log(this.posts);

        if (docs.size < this.pageSize) {
          // all documents have been loaded
          event.target.disabled = true;
        } else {
          event.target.complete();
          this.cursor = this.posts[this.posts.length - 1];

        }

      }).catch((err) => {
        console.log(err);

        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).then((toastData) => {
          console.log(toastData);
          toastData.present();
        });

        this.navCtrl.navigateBack('/home');
      })


  }

  doRefresh(event) {
    this.posts = [];
    this.getPosts();
    this.toggleInfiniteScroll();
    event.target.complete();
  }

  post(event) {

    var rec = {
      postText: this.postText,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    };

    this.datastorageService.datastoreAdd("posts", rec)
      .then((doc) => {
        console.log(doc);

        this.toastCtrl.create({
          message: "Posted successfully!",
          duration: 3000
        }).then((toastData) => {
          console.log(toastData);
          toastData.present();
        });

        this.getPosts();
        this.toggleInfiniteScroll();

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
        this.toggleInfiniteScroll();
        // TODO - deleting first without Infinite Scrolling disable it
      }).catch((err) => {
        console.log(err);
      })

  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  toggleInfiniteScroll() {
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  }



}
