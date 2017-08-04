import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { SigninComponent }  from './login/signin.component';
import { SignupComponent }  from './login/signup.component';
import { HomeComponent }  from './home/home.component';
import {AuthenticationService} from './login/authentication.service';

const appRoutes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent,  canActivate: [AuthenticationService] },
  { path: '',        component: SigninComponent },
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