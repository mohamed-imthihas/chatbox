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
declare var Materialize:any;

@Injectable()
export class UserListService{
	userList:any[]=[];
	currentUser:any;
	 private userChange = new Subject<any>();
	 userChange$ = this.userChange.asObservable();
	constructor(private http:Http,private authService:AuthenticationService,
		private socketService:SocketService,private friendListService:FriendListService){
		this.loadUsers();
	}
	loadUsers(){
		this.currentUser = this.authService.getLoggedUser();
		this.socketService.getUserUpdate().subscribe(data => {
			this.updateUserList(data);
		});
		this.http.post("/getUsers",this.currentUser)
             .toPromise()
             .then(response => {
             	this.userList.splice(0,this.userList.length);
             	this.userList.push.apply(this.userList,response.json());
         	
             });
		this.socketService.getUserStatus().subscribe(data =>{
			for(let i=0;i<this.userList.length;i++){
				if(this.userList[i].email == data.email){
					this.userList[i].online = data.online;
					if(this.userList[i].status != 'U'){
						let msg data.online ? this.userList[i].fullName+" is online": this.userList[i].fullName+" is offline";
						this.spawnMsg(msg);
					}
				}
			}
		});
	}
	getUsers(){
		
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
	private _oldMsg:string = null;
	spawnMsg(msg){
		if(msg != this._oldMsg){
						this._oldMsg = msg;
						Materialize.toast(msg,2000);
					}
					setTimeout(()=>{this._oldMsg = null;});
	}
	updateUserList(newInfo:any){
		let msg:string;
		for(let i=0;i<this.userList.length;i++){
			if(this.userList[i].email == newInfo.email){
				if(newInfo.fullName != undefined){
					this.userList[i].fullName = newInfo.fullName;
				}
				if(newInfo.status != undefined){
					let oldStatus = this.userList[i].status;
					if(newInfo.status == "F" && newInfo.email != this.currentUser.email && oldStatus!="N"){
						msg = this.userList[i].fullName+" has accepted your request";
					}
					else if(newInfo.status == "N" && newInfo.email != this.currentUser.email){
						msg = "New request from "+this.userList[i].fullName;
					}
					else if(newInfo.status == "R" && newInfo.email != this.currentUser.email){
						msg = this.userList[i].fullName + " has rejected your request";
						
					}
					this.spawnMsg(msg);
					this.userList[i].status = newInfo.status;
				}
				if(newInfo.image !=undefined){
					this.userList[i].image = newInfo.image;	
				}

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
		var temp = {
			image:"./images/dp/default.png"
		}
		if(typeof user == 'string'){
			let tp = user;
			user = {
				email:tp
			}
		}
		if(user.email == undefined){
			user.email = this.currentUser.email;
		}
		for(let i=0;i<this.userList.length;i++){
			if(user.email == this.userList[i].email){
				return this.userList[i][type]? this.userList[i][type] : temp[type];
			}
		}
		
		return temp[type];
	}
}