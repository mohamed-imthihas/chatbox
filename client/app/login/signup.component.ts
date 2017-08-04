import { Component,OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder,FormControl } from '@angular/forms';
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";
@Component({
moduleId: __moduleName,
  selector: 'sign-up',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit{
	signupForm:FormGroup;
	constructor(private fb: FormBuilder,private router:Router,private authService:AuthenticationService){
 		
 	}
	ngOnInit(){
		this.signupForm = this.fb.group({
			fullName:["",[Validators.required,Validators.minLength(5),Validators.maxLength(18)]],
			email:["",[Validators.required,Validators.email],[this.asyncValidator.bind(this)]],
			password:["",[Validators.required,Validators.pattern("(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,}")]],
			dob:["",[Validators.required]],
			mobile:["",[Validators.required,Validators.pattern('[0-9]{10}')]]
		})
	}
	signUp(){
		this.authService.signUp(this.signupForm.value).then((isSuccess)=>{
			if(isSuccess){
				this.router.navigate(["/"]);		
			}
		});	

	}
	validateEmail(c: FormControl) {
		return new Promise((resolve,reject)=>{

			if(c.value == "imthihas94@gmail.com"){
				console.log(c.value)
				 resolve(null);
			}
			else{
				resolve( {
				    validateEmail: true
				  });		
			}
		});
	  /*if(c.value == "imthihas94@gmail.com"){
	  	return null;
	  }
	  else{
	  	return {
		    validateEmail: {
		      valid: false
		    }
		  }
	  }*/
	}
	 asyncValidator(control: FormControl) {
        //return new Promise (resolve => {
          return this.authService.checkEmail(control.value)
                .toPromise().then((data :any) => {
                    let res = data.json();
                    if(!res.alreadyExist){
						return (null);
                    }
                    else{
                    	return ({ "alreadyExist": true });
                    }
                    
                });
          //  });
            /*if(control.value == "imthihas94@gmail.com"){
	  	return null;
	  }
	  else{
	  	return {
		      valid: false
		    }
		  
	  }*/
      }
}