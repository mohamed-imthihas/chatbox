import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'sort',pure: false})
export class SortPipe implements PipeTransform {
  transform(value:any[]) {
  	if(!value){
  		return value;
  	}
  	value.sort((user1,user2)=>{
  		return new Date(user2.lastActivity).getTime() - new Date(user1.lastActivity).getTime();
  	});
  	return value.filter(user => !(user.status == "N" || user.status == "U"));
  }
}