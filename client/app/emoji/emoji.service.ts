import { Injectable } from "@angular/core";
@Injectable()
export class EmojiService{
	toRawText(value:string){
		let imgTags = value.match(/<img([\w\W]+?)>/g));
		if(imgTags != null)
		for(let i=0;i<imgTags.length;i++){
			var imgTag = imgTags[i];
			let index = value.indexOf(imgTag);
			let tagName = imgTag.match(/data-emoji-colon="[\w]+"/)[0].match(/"[\w]+"/)[0];
			value = value.replace(imgTag,":"+tagName.slice(1,-1)+":");	
		}
		value = value.replace(/&nbsp;/g," ");
		return value;
	}
}