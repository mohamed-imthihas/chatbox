import { Component,EventEmitter} from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {AuthenticationService} from "../login/authentication.service";
import {Router} from "@angular/router";
import {MaterializeDirective, MaterializeAction} from "angular2-materialize";
declare var Materialize:any;
@Component({
moduleId: __moduleName,
  selector: 'sign-up',
  templateUrl: './forgetpassword.component.html',
  styleUrls:["./forgetpassword.component.css"]
})
export class ForgetPasswordComponent{
	userInfoForm:FormGroup;
	newPassForm:FormGroup;
	isUserInfoCrct:boolean;
	showError:boolean;
	actions1 = new EventEmitter<string|MaterializeAction>();
	minDate:Date;
	maxDate:Date;
	constructor(private authService:AuthenticationService,private fb:FormBuilder,private router:Router){
		this.userInfoForm = this.fb.group({
			email:["",[Validators.required,Validators.email]],			
			dob:["",[Validators.required]]
		});
		this.newPassForm = this.fb.group({
			password:["",[Validators.required,Validators.pattern("(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,}")]],
		});
		this.minDate = new Date(1970,1,1);
 		this.maxDate = new Date();
	}
	checkUserInfo(){
		this.authService.checkEmailAndDOB(this.userInfoForm.value).then((isSuccess)=>{
			if(isSuccess){
				this.isUserInfoCrct = true;
				 this.actions1.emit({action:"collapsible",params:['open',1]});
			}
			else{
				this.showError = true;
			}
		})
	}
	setNewPassword(){
		let obj = {
			email:this.userInfoForm.value.email,
			password:this.newPassForm.value.password
		}
		this.authService.resetPassword(obj).then((isSuccess)=>{
			this.router.navigate(["/"]);
			Materialize.toast("New password has been set",2000);
		});	
	}
}