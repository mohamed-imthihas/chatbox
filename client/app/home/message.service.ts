import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';
import {AuthenticationService} from "../login/authentication.service";
import {SocketService} from "./socket.service";
import {User} from "../login/user.model";

@Injectable()
export class MessageService{
	socket:any;
	currentUser:User;
	toUser:User;
	messages:any[] = [];
	constructor(private authService:AuthenticationService,private http:Http,private socketService:SocketService){
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
		this.socketService.getMessages().subscribe(data=>{
			if(this.toUser.email != data.from){
				return;
			}
			this.messages.push(data);
		});
		return this.messages;
	}
	sendMessage(message:string){
		let msg = {
			from:this.currentUser.email,
			to:this.toUser.email,
			msg:message,
			time:new Date(),
			status:0
		}
		this.messages.push(msg);
		//this.socket.emit("sentMessage",msg);
		this.socketService.sendMessage(msg);
	}
	setToUser(user:User){
		this.toUser = user;
		this._loadMsgs();
		
	}
	private _loadMsgs(){
		this.messages.splice(0,this.messages.length);
		this.http.post("/getMessages",{user1:this.currentUser.email,user2:this.toUser.email}).toPromise().then((data)=>{
			this.messages.push.apply(this.messages,data.json());
		});
	}
	getToUser(){
		return this.toUser;
	}
}