import { Component,OnInit,EventEmitter } from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {UserListService} from "./userlist.service";
import {AuthenticationService} from "../login/authentication.service";
import {Router} from "@angular/router";
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
declare var $:any;
declare var Materialize:any;
@Component({
moduleId: __moduleName,
  selector: 'user-list',
  templateUrl: './profile.component.html',
  styleUrls:['./profile.component.css']
})
export class ProfileComponent implements OnInit{
	userDetail:FormGroup;
	passForm:FormGroup;
	user:any
	editMode:boolean=false;
	passwordError:boolean;
	modalActions1 = new EventEmitter<string|MaterializeAction>();
	constructor(private authService:AuthenticationService,private fb:FormBuilder){
		
	}
	ngOnInit(){
		this.userDetail = this.fb.group({
			fullName:["",[Validators.required,Validators.minLength(5),Validators.maxLength(18)]],
			dob:["",[Validators.required]],
			mobile:["",[Validators.required,Validators.pattern('[0-9]{10}')]]
		});
		this.passForm =  this.fb.group({
			oldpassword:["",[Validators.required]],
			newpassword:["",[Validators.required,Validators.pattern("(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,}")]],
		});
		this.authService.getUserInfo().then((data)=>{
			this.user = data;
			//this.userDetail.setValue(this.user);
			
			this.disableForm();
			Materialize.updateTextFields();	
		})
	}
	enableForm(){
		this.editMode=true;
		this.userDetail.controls["fullName"].enable();
		this.userDetail.controls["dob"].enable();
		this.userDetail.controls["mobile"].enable();
	}
	disableForm(){
		this.editMode=false;
		this.userDetail.controls["fullName"].disable();
		this.userDetail.controls["dob"].disable();
		this.userDetail.controls["mobile"].disable();
		this.userDetail.setValue(this.user);
	}
	submitForm(){
		this.authService.setUserInfo(this.userDetail.value).then(()=>{
			this.user = this.userDetail.value;
			this.disableForm();
			Materialize.toast("Information updated",2000);
		});
	}
	uploadImage(fileEvent){
		let file = fileEvent.target.files[0];
		this.authService.changeImage(file);
	}
	changePassword(){
		this.authService.changePassword(this.passForm.value).then((isSuccess)=>{
			if(isSuccess){
				this.closePasswordModal();
				Materialize.toast("Password updated",2000);
			}else{
				this.passwordError = true;
			}
		})
	}
	openPasswordModal() {
		this.passForm.reset();
		this.passwordError = false;
    	this.modalActions1.emit({action:"modal",params:['open']});
  	}
  	closePasswordModal() {
    this.modalActions1.emit({action:"modal",params:['close']});
  }
}