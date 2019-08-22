import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagesComponent } from './images/images.component';
import { TextComponent } from './text/text.component';

@NgModule({
  declarations: [
    AppComponent,
    ImagesComponent,
    TextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAngularModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
