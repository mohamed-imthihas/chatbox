import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { CanActivate }    from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs";
import { Subject }    from 'rxjs/Subject';
import { User } from "./user.model";

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
	getLoggedUser():User{
		return this.currentUser;
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
	loggedOut(){
		sessionStorage.removeItem("user");
		this.currentUser = null;
		this.userDisconnect.next();
	}
}