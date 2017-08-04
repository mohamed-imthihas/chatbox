import { Pipe, PipeTransform,SecurityContext } from '@angular/core';
import { EmojiPickerOptions } from 'angular2-emoji-picker';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({name: 'emoji'})
export class EmojiPipe implements PipeTransform {
	constructor(private emojiPickerOptions: EmojiPickerOptions,private sanitizer: DomSanitizer){

	}
  transform(value:string): number {
  	if(value == ""){
  		return null;
  	}
  	let tagNames = value.match(/:[\w]+:/g);
  	if(tagNames != null)
	for(let i=0;i<tagNames.length;i++){
		let tagName = tagNames[i];
  		let emojiElement = this.emojiPickerOptions.getEmojiElement({label:tagName.slice(1,-1)});
  		let tmp = document.createElement('div');
  		tmp.appendChild(emojiElement)
  		let tag = tmp.innerHTML;
  		value = value.replace(tagName,tag);
  	}
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}