import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TextComponent } from './text/text.component';
import { ImagesComponent } from './images/images.component';

const routes: Routes = [
  { path: '', redirectTo: 'text', pathMatch: 'full' },
  { path: 'text', component: TextComponent },
  { path: 'images', component: ImagesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
