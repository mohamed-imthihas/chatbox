import { Component,OnInit,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {UserListService} from "./userlist.service";
import {MessageService} from "./message.service";
import {Router} from "@angular/router";
import { EmojiPickerOptions } from 'angular2-emoji-picker';
import { EmojiPickerAppleSheetLocator } from 'angular2-emoji-picker/lib-dist/sheets/index'
@Component({
moduleId: __moduleName,
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls:['./chat.component.css']
})
export class ChatComponent implements OnInit,AfterViewChecked {
	@ViewChild('msgDiv') private msgDiv: ElementRef;
	users:any[];
	toUser:any;
	messages:any[];
	message:string;
	tempDate:Date;
	constructor(private userListService:UserListService,private msgService:MessageService,private emojiPickerOptions: EmojiPickerOptions){
		this.emojiPickerOptions.setEmojiSheet({
      url: 'sheet_apple_32.png',
      locator: EmojiPickerAppleSheetLocator
    });		
	}
	ngOnInit(){

		this.userListService.userChange$.subscribe((data)=>{
			this.toUser = data;
			this.msgService.setToUser(data);
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
}