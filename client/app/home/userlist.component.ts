import { Component,OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {UserListService} from "./userlist.service";
import {AuthenticationService} from "../login/authentication.service";
import {Router} from "@angular/router";
@Component({
moduleId: __moduleName,
  selector: 'user-list',
  templateUrl: './userlist.component.html',
  styleUrls:['./userlist.component.css']
})
export class UserListComponent implements OnInit{
	users:any[]=[];
	currentUser:any;
	constructor(private userListService:UserListService,private authService:AuthenticationService){
		this.users = this.userListService.getUsers();
	}
	ngOnInit(){
		this.currentUser = this.authService.getLoggedUser();
	}
	changeUser(user:any){
//		this.userListService.changeUser(user);
	}
	add(user:any){
		this.userListService.addFriend(user);
	}
	accept(user:any){
		this.userListService.respondRequest(user,"accept");
	}
	reject(user:any){
		this.userListService.respondRequest(user,"reject");
	}
}