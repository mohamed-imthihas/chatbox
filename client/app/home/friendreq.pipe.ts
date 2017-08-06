import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'friendRequest',pure: false})
export class FriendRequestPipe implements PipeTransform {
  transform(value:any[]) {
  	if(!value){
  		return value;
  	}
  	return value.filter((user) => user.status == "N");
  }
}