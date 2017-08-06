import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';
import {AuthenticationService} from "../login/authentication.service";
import {SocketService} from "./socket.service";
import {FriendListService} from "./friendlist.service";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class UserListService{
	userList:any[]=[];
	currentUser:any;
	 private userChange = new Subject<any>();
	 userChange$ = this.userChange.asObservable();
	constructor(private http:Http,private authService:AuthenticationService,
		private socketService:SocketService,private friendListService:FriendListService){
		this.currentUser = this.authService.getLoggedUser();
		this.getUsers();
		this.socketService.getUserStatus().subscribe(data =>{
			for(let i=0;i<this.userList.length;i++){
				if(this.userList[i].email == data.email){
					this.userList[i].online = data.online;
				}
			}
		});
	}
	getUsers(){
		this.socketService.getUserUpdate().subscribe(data => {
			this.updateUserList(data);
		});
		this.http.post("/getUsers",this.currentUser)
             .toPromise()
             .then(response => {
             	this.userList.splice(0,this.userList.length);
             	this.userList.push.apply(this.userList,response.json());
         	
             });
        return this.userList;
	}
	changeUser(user:any){
		this.userChange.next(user);
	}
	addFriend(user:any){
		let req= {
			currentUser:this.currentUser,
			friend:user
		}
		this.http.post("/addFriend",req).toPromise()
		.then(response =>{
			this.updateUserList(response.json());
			this.friendListService.updateUserList(response.json());
		});
	}

	updateUserList(newInfo:any){
		for(let i=0;i<this.userList.length;i++){
			if(this.userList[i].email == newInfo.email){
				this.userList[i].status = newInfo.status;
				return;
			}
		}
		if(newInfo.status == "U"){
			this.userList.push(newInfo);
		}
	}
	respondRequest(user:any,type:string){
		let req= {
			currentUser:this.currentUser,
			friend:user,
			type:type,
		}
		this.http.post("/respondRequest",req).toPromise()
		.then(response => {
			this.updateUserList(response.json());
			if(type == "accept"){
				this.friendListService.updateUserList(response.json());
			}
		});
	}
	getProp(user,type){
		for(let i=0;i<this.userList.length;i++){
			if(user.email == this.userList[i].email){
				return this.userList[i][type];
			}
		}
		var temp = {
			image:"./images/dp/default.jpg"
		}
		return temp[type];
	}
}