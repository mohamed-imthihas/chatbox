import { Pipe, PipeTransform } from '@angular/core';
import {UserListService} from "./userlist.service";

@Pipe({name: 'userinfo',pure: false})
export class UserDpPipe implements PipeTransform {
	constructor(private userListService:UserListService){}
  transform(value:any,type:string) {
  	if(!value){
  		return value;
  	}
  	return this.userListService.getProp(value,type);
  }
}