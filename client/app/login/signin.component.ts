import { Component,OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";
export class Hero {
  id: number;
  name: string;
}

@Component({
moduleId: __moduleName,
  selector: 'sign-in',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit{
	signinForm:FormGroup;
	title:string="Sign";
	loginError:boolean;
 	constructor(private fb: FormBuilder,private router:Router,private authService:AuthenticationService){
 		
 	}
 	ngOnInit() {
 		this.signinForm = this.fb.group({
 			email : ['',[Validators.required,Validators.email]],
 			password:['',[Validators.required]]
 		});
 	}
 	login(){
 		 this.authService.login(this.signinForm.value).then((result)=>{
 		 	if(result){
 		 		this.router.navigate(['home']);
 		 		return;
 		 	}
 		 	this.loginError = true;
 		 })
 	}
 	
}
