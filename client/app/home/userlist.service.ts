import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import * as io from 'socket.io-client';
import {AuthenticationService} from "../login/authentication.service";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class UserListService{
	userList:any[];
	currentUser:any;
	 private userChange = new Subject<any>();
	 userChange$ = this.userChange.asObservable();
	constructor(private http:Http,private authService:AuthenticationService){
		this.currentUser = this.authService.getLoggedUser();
	}
	getUsers(){
		 return this.http.post("/getUsers",this.currentUser)
             .toPromise()
             .then(response => {
             	this.userList = response.json();
             	return this.userList;
             });
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
			user.status="R";
		});
	}
}