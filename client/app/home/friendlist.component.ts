import { Component,OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {FriendListService} from "./friendlist.service";
import {AuthenticationService} from "../login/authentication.service";
import {Router} from "@angular/router";
@Component({
moduleId: __moduleName,
  selector: 'friend-list',
  templateUrl: './friendlist.component.html',
  styleUrls:['./friendlist.component.css']
})
export class FriendListComponent implements OnInit{
	users:any[]=[];
	currentUser:any;
	constructor(private userListService:FriendListService,private authService:AuthenticationService){
	}
	ngOnInit(){
		this.users = this.userListService.getUsers();
		this.currentUser = this.authService.getLoggedUser();
	}
	changeUser(user:any){
		this.userListService.changeUser(user);
	}
}