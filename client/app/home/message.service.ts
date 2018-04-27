import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';
import {AuthenticationService} from "../login/authentication.service";
import {SocketService} from "./socket.service";
import {UserListService} from "./userlist.service";

import {User} from "../login/user.model";
declare var Materialize:any;
@Injectable()
export class MessageService{
	socket:any;
	currentUser:User;
	toUser:User;
	messages:any[] = [];
	constructor(private authService:AuthenticationService,private http:Http,private socketService:SocketService,private userListService:UserListService ){
		this.currentUser = this.authService.getLoggedUser();
	}
	/*private _getMessages() {
	    let observable = new Observable(observer => {
	      this.socket = io.connect({query:this.currentUser});
	      this.socket.on('recMessage', (data:any) => {
	        observer.next(data);    
	      });
	      return () => {
	        this.socket.disconnect();
	      };  
	    })     
	    return observable;
	}*/
	getMessage(){
		this.currentUser = this.authService.getLoggedUser();
		this.socketService.getMessages().subscribe(data=>{
			Materialize.toast("New Message from "+this.userListService.getProp(data.from,"fullName"),2000);
			if(this.toUser == null || this.toUser.email != data.from){
				return;
			}
			this.http.post("/setunread",{user1:this.currentUser.email,user2:this.toUser.email}).toPromise()
			.then(()=>{});
			this.messages.push(data);
		});
		return this.messages;
	}
	sendMessage(message:string){
		let msg = {
			from:this.currentUser.email,
			to:this.toUser.email,
			msg:message
		}
		//this.messages.push(msg);
		//this.socket.emit("sentMessage",msg);
		this.socketService.sendMessage(msg,(data)=>{
			this.messages.push(data);
		});
	}
	setToUser(user:User){
		this.toUser = user;
		this._loadMsgs();
		
	}
	private _loadMsgs(){
		this.messages.splice(0,this.messages.length);
		this.http.post("/getMessages",{user1:this.currentUser.email,user2:this.toUser.email}).toPromise().then((data)=>{
			this.messages.splice(0,this.messages.length);
			this.messages.push.apply(this.messages,data.json());
		});
	}
	getToUser(){
		return this.toUser;
	}
}