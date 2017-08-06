import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';
import {AuthenticationService} from "../login/authentication.service";
import {SocketService} from "./socket.service";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class FriendListService{
	userList:any[]=[];
	currentUser:any;
	 private userChange = new Subject<any>();
	 userChange$ = this.userChange.asObservable();
	constructor(private http:Http,private authService:AuthenticationService,private socketService:SocketService){
		this.currentUser = this.authService.getLoggedUser();
		
	}
	getUsers(){
		this.socketService.getFriendUpdate().subscribe(data => {
			console.log("socker",data);
			this.updateUserList(data);
		});
		this.http.post("/getFriends",this.currentUser)
             .toPromise()
             .then(response => {
             	this.userList.splice(0,this.userList.length)
             	this.userList.push.apply(this.userList,response.json());
             });
        return this.userList;
	}
	changeUser(user:any){
		this.userChange.next(user);
	}
	updateUserList(newInfo:any){
		for(let i=0;i<this.userList.length;i++){
			if(this.userList[i].email == newInfo.email){
				this.userList[i].status = newInfo.status;
				this.userList[i].lastActivity = newInfo.lastActivity;
				this.userList[i].unread = newInfo.unread;
				return;
			}
		}
		this.userList.push(newInfo);
	}
}