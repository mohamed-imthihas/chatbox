import { Pipe, PipeTransform } from '@angular/core';
import {UserListService} from './userlist.service';
@Pipe({name: 'usersort',pure: false})
export class UserSortPipe implements PipeTransform {
	constructor(private userListService:UserListService){}
  transform(value:any[]) {
  	if(!value){
  		return value;
  	}
  	value.sort((user1,user2)=>{
  		if(user1 && user2 && user1.fullName && user2.fullName)
  			return user1.fullName.toLowerCase().localeCompare(user2.fullName.toLowerCase());
  		else
  			return 0;
  	});
  	return value;
  }
}