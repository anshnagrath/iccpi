import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'product-login',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  encapsulation:ViewEncapsulation.None,
})
export class ProductComponent implements OnInit,OnDestroy {
  allProducts: Observable<any>;
  userProducts: Array<String> = [];
  usersInfo: Number = 10;
  subscriptions: Array<Subscription> = [ ];
  constructor(public appService: AppService, public router: Router, public matDialog: MatDialog) {
   
   }

  ngOnInit() {
    const limitObj = { limit: 10, pageNumber: 1};
    const allProduct = this.appService.getUsers(limitObj).subscribe((users: HttpResponse<any>) => {
      console.log(users,'usssseersds');
      this.allProducts = users['data'];
    });
    this.subscriptions.push(allProduct);
  }
  getData(event){
      console.log(event,'eventttt')
      let obj = {
        limit: event.pageSize,
        pageNumber:event.length ,
        previousPage: event.previousPageIndex,
      }
    const allProduct = this.appService.getUsers(obj).subscribe((users: HttpResponse<any>) => {
      this.allProducts = users['data'];
    });
    this.subscriptions.push(allProduct);
  }
  onSelectChange(limit){
    const limitObj = { limit: limit };
    const allProduct = this.appService.getUsers(limitObj).subscribe((users: HttpResponse<any>) => {
      console.log(users, 'usssseersds');
      this.allProducts = users['data'];
    });
    this.subscriptions.push(allProduct);
  }
  ngOnDestroy(){
    this.subscriptions.forEach((subscription)=>{
      subscription.unsubscribe();
    })
  }
}
