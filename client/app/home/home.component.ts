import { Component,OnInit } from '@angular/core';
import  {Router} from "@angular/router";
import {AuthenticationService} from '../login/authentication.service';
@Component({
moduleId: __moduleName,
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls:['./home.component.css']
})
export class HomeComponent{
	isAll:boolean;
	isChat:boolean;
	currentUser:any;
	constructor(private router:Router,private authService:AuthenticationService) {
       router.events.subscribe((event)=>{
          this.isAll = router.url.indexOf("all") != -1;
          this.isChat = router.url.indexOf("chat") != -1;
       });
       this.currentUser = this.authService.getLoggedUser();
    }
    logout(){
    	this.authService.loggedOut();
    	this.router.navigate(["/"]);
    }
}