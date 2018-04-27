import { Pipe, PipeTransform } from '@angular/core';
import {UserListService} from "./userlist.service";

@Pipe({name: 'friendRequest',pure: false})
export class FriendRequestPipe implements PipeTransform {
  transform(value:any[]) {
  	if(!value){
  		return value;
  	}
  	return value.filter((user) => user.status == "N");
  }
}
@Pipe({name: 'requestCount',pure: false})
export class RequestCountPipe implements PipeTransform {
	constructor(private userListService:UserListService){}
  transform(value:any) {
  	return this.userListService.userList.filter((user) => user.status == "N").length;
  }
}