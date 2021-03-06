import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';
import {AuthenticationService} from "../login/authentication.service";
import {User} from "../login/user.model";

@Injectable()
export class SocketService{
	socket:any;
	currentUser:User;
	constructor(private authService:AuthenticationService){
		this.currentUser = this.authService.getLoggedUser();
		 this.socket = io.connect({query:this.currentUser});
		 this.authService.userDisconnect$.subscribe(()=>{
		 	this.currentUser = this.authService.getLoggedUser();
		 	if(this.currentUser == null)
		 	{
		 		this.socket.disconnect();
		 	}
		 	else{
		 		this.socket = io.connect({query:this.currentUser});
		 	}
		 });
	}
	getMessages(){
		 let observable = new Observable(observer => {
	      this.socket.on('recMessage', (data:any) => {
	        observer.next(data);    
	      });
	      return () => {
	        this.socket.disconnect();
	      };  
	    })     
	    return observable;
	}
	getUserUpdate(){
		 let observable = new Observable(observer => {
	      this.socket.on('updateUserList', (data:any) => {	      	
	        observer.next(data);    
	      });
	      return () => {
	        this.socket.disconnect();
	      };  
	    })     
	    return observable;
	}
	getFriendUpdate(){
		let observable = new Observable(observer => {
	      this.socket.on('updateFriendList', (data:any) => {
	        observer.next(data);    
	      });
	      return () => {
	        this.socket.disconnect();
	      };  
	    })     
	    return observable;	
	}
	getUserStatus(){
		let observable = new Observable(observer => {
	      this.socket.on('userOnline', (data:any) => {
	        observer.next(data);    
	      });
	      return () => {
	        this.socket.disconnect();
	      };  
	    })     
	    return observable;		
	}
	sendMessage(msg:any,fn){
		this.socket.emit("sentMessage",msg,fn);
	}
	disconnect(){
		this.socket.disconnect();
	}
}