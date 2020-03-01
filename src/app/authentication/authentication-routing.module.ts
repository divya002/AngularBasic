import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { AdminComponent } from '../admin/admin.component';
import { RegisterFormComponent } from '../register-form/register-form.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: AdminComponent},
      {path: 'login', component: LoginComponent},
      { path: 'register', component: RegisterFormComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
