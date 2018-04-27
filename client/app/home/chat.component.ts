import { Component,OnInit,AfterViewChecked, ElementRef, ViewChild,OnDestroy } from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {FriendListService} from "./friendlist.service";
import {MessageService} from "./message.service";
import {Router,NavigationEnd} from "@angular/router";
import { EmojiPickerOptions } from 'angular2-emoji-picker';
import { EmojiPickerAppleSheetLocator } from 'angular2-emoji-picker/lib-dist/sheets/index'
import { ISubscription } from "rxjs/Subscription";
@Component({
moduleId: __moduleName,
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls:['./chat.component.css']
})
export class ChatComponent implements OnInit,AfterViewChecked,OnDestroy {
	@ViewChild('msgDiv') private msgDiv: ElementRef;
	users:any[];
	toUser:any;
	messages:any[];
	message:string;
	tempDate:Date;
	private subscription: ISubscription;
	constructor(private userListService:FriendListService,private msgService:MessageService,private emojiPickerOptions: EmojiPickerOptions,private router:Router){
			this.emojiPickerOptions.setEmojiSheet({
	      url: 'sheet_apple_32.png',
	      locator: EmojiPickerAppleSheetLocator
	    });
		router.events.subscribe((event)=>{
          if(event instanceof NavigationEnd && this.toUser == null && this.router.url.indexOf("chat") != -1){
	    		this.router.navigate(["/home"]);
	    	}
       });
		/*if(this.toUser == null)	{
	    	this.router.navigate(["/home"]);
	    }*/
	    
	}
	ngOnInit(){
		this.subscription = this.userListService.userChange$.subscribe((data)=>{
			this.toUser = data;
			this.msgService.setToUser(data);
			this.router.navigate(["/home/chat"]);
		})
		this.messages = this.msgService.getMessage();
	}
	 ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    scrollToBottom(): void {
        try {
            this.msgDiv.nativeElement.scrollTop = this.msgDiv.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
	sendMessage($event){
		this.msgService.sendMessage($event);
	}
	checkDateForDisplay(date:string){
		if(!this.tempDate  || this.tempDate.toDateString() != new Date(date).toDateString()){
			this.tempDate = new Date(date);
			return true;
		}
		return false;
	}
	ngOnDestroy(){
		 this.subscription.unsubscribe();
	}
}