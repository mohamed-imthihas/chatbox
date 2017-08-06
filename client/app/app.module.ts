import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule  }   from '@angular/forms'; 
import {HttpModule} from '@angular/http';
import {MaterializeModule} from 'angular2-materialize';
import { EmojiPickerModule } from 'angular2-emoji-picker';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }  from './app.component';
import { SigninComponent }  from './login/signin.component';
import { SignupComponent }  from './login/signup.component';
import { AuthenticationService }  from './login/authentication.service';

import { HomeComponent }  from './home/home.component';
import { UserListComponent }  from './home/userlist.component';
import { UserListService }  from './home/userlist.service';
import { FriendListComponent }  from './home/friendlist.component';
import { FriendListService }  from './home/friendlist.service';
import {ChatComponent} from "./home/chat.component";
import  {MessageService} from './home/message.service';
import {EmojiModule} from "./emoji/emoji.module"
import {SocketService} from "./home/socket.service";
import {FriendRequestPipe} from "./home/friendreq.pipe";
import {SortPipe} from "./home/sort.pipe";
import {UserDpPipe} from "./home/userdp.pipe";



@NgModule({
  imports: [
    BrowserModule,MaterializeModule,ReactiveFormsModule,FormsModule,HttpModule, EmojiModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    UserListComponent,
    ChatComponent,
    FriendRequestPipe,
    FriendListComponent,
    SortPipe,
    UserDpPipe
  ],
  providers:[AuthenticationService,MessageService,UserListService,SocketService,FriendListService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }