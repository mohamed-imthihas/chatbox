import { Component,OnInit,AfterViewChecked, ElementRef, ViewChild,EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {UserListService} from "./userlist.service";
import {MessageService} from "./message.service";
import {Router} from "@angular/router";
import { EmojiPickerOptions } from 'angular2-emoji-picker';
import { EmojiPickerAppleSheetLocator } from 'angular2-emoji-picker/lib-dist/sheets/index';
import  {ContenteditableDirective} from "./contenteditable.directive";
import  {EmojiService} from "./emoji.service"


@Component({
moduleId: __moduleName,
  selector: 'emoji-input',
  templateUrl: './emojiinput.component.html',
  styleUrls:['./emojiinput.component.css']
})
export class EmojiInputComponent implements OnInit {
	@ViewChild('msgDiv') private msgDiv: ElementRef;
	content:string="";
	constructor(private emojiPickerOptions: EmojiPickerOptions,private emojiService:EmojiService){
		this.emojiPickerOptions.setEmojiSheet({
		      url: 'sheet_apple_32.png',
		      locator: EmojiPickerAppleSheetLocator
    	});		
	}
	@Output() onSend = new EventEmitter<string>();
	send(){

		this.onSend.emit(this.emojiService.toRawText(this.content));
	}
	handleSelection($event){
		const emojiElement = this.emojiPickerOptions.getEmojiElement($event);
		let tmp = document.createElement('div');
  		tmp.appendChild(emojiElement)
  		this.content += tmp.innerHTML;
		//this.msgDiv.nativeElement.append(emojiElement);
		//this.msgDiv.nativeElement.focus();
	}
}
