import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { SigninComponent }  from './login/signin.component';
import { SignupComponent }  from './login/signup.component';
import { HomeComponent }  from './home/home.component';
import {AuthGuard} from './login/auth-guard.service';
import {GuestGuard} from './login/guest-guard.service';

import {FriendListComponent} from "./home/friendlist.component";
import {UserListComponent} from "./home/userlist.component";
import {ProfileComponent} from "./home/profile.component";
import {ForgetPasswordComponent} from "./home/forgetpassword.component";

const appRoutes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [GuestGuard] },
  { path: 'home', component: HomeComponent,  canActivate: [AuthGuard],
children:[
  {path:'all',component:UserListComponent},
  {path:'**',component:FriendListComponent},
]},
  { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard]},
  { path: 'forgetpassword', component: ForgetPasswordComponent, canActivate: [GuestGuard],},
  { path: '',        component: SigninComponent,canActivate: [GuestGuard], },
  { path: '**',        redirectTo: '',canActivate: [GuestGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,{useHash: true}
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}