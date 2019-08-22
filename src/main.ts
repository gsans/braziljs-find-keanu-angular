import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import Predictions from '@aws-amplify/predictions';
import amplify from './aws-exports';
Auth.configure(amplify);
Storage.configure(amplify);
Predictions.configure(amplify);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
