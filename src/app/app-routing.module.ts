import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from '../app/app.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
