import { Component, OnInit, ViewChild } from '@angular/core';


import { NavController, ToastController, IonInfiniteScroll } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { DatastorageService } from '../services/datastorage.service';
import * as moment from 'moment';
import { EventEmitter } from 'events';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { LoadingService } from '../services/loading.service';
import { AuthenticationService } from '../services/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


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
  image: string;
  percentage: number = 0;

  constructor(
    private datastorageService: DatastorageService,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingService,
    private authService: AuthenticationService,
    private camera: Camera,
  ) {

    this.getPosts();

  }

  ngOnInit() {
  }

  getPosts() {

    this.posts = [];


    this.loadingCtrl.present("Refreshing feed");


    let query = this.datastorageService.datastoreSnapshot("posts", "created", 'desc', this.pageSize, undefined);

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
      .then(async (doc) => {
        console.log(doc);

        if (this.image) {
          await this.upload(doc.id);
        }

        this.postText = "";
        this.image = undefined;

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

    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;

  }


  logout() {

    console.log("Calling logout function");

    this.authService.logoutUser().then(
      () => {

        this.toastCtrl.create({
          message: "Bye! Logged out successfully.",
          duration: 3000
        }).then((toastData) => {
          console.log(toastData);
          toastData.present();
        });

        this.navCtrl.navigateRoot('/home');

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

  addPhoto() {

    console.log("Launching camera");

    this.launchCamera();
  }

  launchCamera() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    }

    this.camera.getPicture(options).then((base64Image) => {
      console.log(base64Image);
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }

  upload(name: string) {

    this.percentage = 0;

    return new Promise((resolve, reject) => {

      this.percentage = 0

      this.loadingCtrl.present("Uploading image " + this.percentage + "%");

      let ref = firebase.storage().ref("postImages/" + name);
      let uploadTask = ref.putString(this.image.split(',')[1], "base64");
      uploadTask.on("state_changed", (taskSnapshot) => {
        console.log(taskSnapshot);

      }, (error) => {
        console.log(error);
      }, () => {
        console.log("Upload has completed");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          firebase.firestore().collection("posts").doc(name).update({
            image: url
          }).then(() => {
            this.loadingCtrl.dismiss();
            resolve();
          }).catch((err) => {
            this.loadingCtrl.dismiss();
            reject();
          })
        }).catch((err) => {
          this.loadingCtrl.dismiss();
          reject();
        })
      })


    })
  }

}
