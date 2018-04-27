import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs";
import { Subject }    from 'rxjs/Subject';
import { User } from "./user.model";
declare var Materialize:any;
@Injectable()
export class AuthenticationService implements CanActivate{
	currentUser:User;
	 private userDisconnect = new Subject<any>();
	 userDisconnect$ = this.userDisconnect.asObservable();
	constructor(private http:Http){
		this.currentUser = JSON.parse(sessionStorage.getItem("user"));
	}
	login(user:User){
		 return this.http.post("/validate",user)
             .toPromise()
             .then(response => {
             	let result = response.json();
             	if(result.logged){
             		this.currentUser = {fullName:result.fullName,email:result.email};
             		sessionStorage.setItem("user",JSON.stringify(this.currentUser));
             		this.userDisconnect.next();
             	}
             	return result.logged;
             });

	}
	signUp(user:User){
		return this.http.post("/newUser",user).toPromise().then(response => {
			let result = response.json();
            return result.status != 'failed';
		});
	}
	getUserInfo(){
		return this.http.post("/getUserInfo",this.currentUser).toPromise()
		.then(response =>{
			return response.json();
		})
	}
	setUserInfo(user){
		return this.http.post("/setUserInfo",{email:this.currentUser.email,user:user}).toPromise()
		.then((response)=>{
			return response.json().status != "failed";
		})
	}
	getLoggedUser():User{
		return this.currentUser;
	}
	changeImage(file){
		
		let formData = new FormData();
        formData.append('file1', file);
        formData.append("email",this.currentUser.email);
        return this.http.post("/uploadImage",formData).toPromise()
        .then(()=>{
        	console.log("hi");
        	Materialize.toast("Profile Photo updated",2000);
        });
	}
	isLogged():boolean{
		return this.currentUser == null? false : true;
	}
	canActivate(){
		return this.isLogged();
	}
	checkEmail(email:string):Observable{
		return this.http.post("/checkEmail",{email:email});
	}
	changePassword(passwords){
		return this.http.post("/changePassword",{email:this.currentUser.email,passwords:passwords}).toPromise()
		.then((response)=>{
			return response.json().status != "failed";
		})
	}
	checkEmailAndDOB(user){
		return this.http.post("/checkEmailAndDOB",user).toPromise()
		.then((response)=>{
			return response.json().status != "failed";
		})	
	}
	resetPassword(user){
		return this.http.post("/resetPassword",user).toPromise()
		.then((response)=>{
			return response.json().status != "failed";
		})
	}
	loggedOut(){
		sessionStorage.removeItem("user");
		this.currentUser = null;
		this.userDisconnect.next();
	}
}