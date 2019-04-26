import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthenticationService } from './services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ReactiveFormsModule } from '@angular/forms';

import { DatastorageService } from './services/datastorage.service';
import { LoadingService } from './services/loading.service';

import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireAuthModule, ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    DatastorageService,
    LoadingService,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
