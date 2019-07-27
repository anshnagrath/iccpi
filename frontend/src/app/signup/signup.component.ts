import { Component, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {  FormGroup,FormBuilder,Validators} from '@angular/forms';
import { AppService } from '../app.service';
import {Router,ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  loginMethod: Boolean = true;
  signUpForm: FormGroup;
  username: String;  
  loginForm : FormGroup;
  constructor(private fb: FormBuilder, private appService: AppService, private router: Router, private activateRoutes: ActivatedRoute, private cd: ChangeDetectorRef) {
    this.appService.loginStatus.subscribe((status) => {
      this.loginMethod = status;
    });

   this.loginForm  = this.fb.group({
     username: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
 });
}

  login(formDirective){
    let obj = {
      username: this.username
    }
   const loginSub = this.appService.login(obj).subscribe((data)=>{
      if(data['status'].code ==200){
        formDirective.resetForm();
        this.loginForm.reset();
        this.appService.openSnackBar("User login sucessfull","Sucess")
        this.router.navigate(["product"]);
      }

      if (data['status'].code ==  404){
       this.appService.openSnackBar("User not found in the database", "Error")
     }
    })
     this.subscription.add(loginSub);
  }
  ngOnDestroy(){
    (this.subscription)?this.subscription.unsubscribe() : '';
  }
}