import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  customer_name:any;

  Customers:any [ ]=[]

  page = 1;
pageSize = 20
collectionSize = 0;


  constructor(public config:ConfigService,public shared:SharedDataService,
    public router:Router,public toast:ToasterService) {
    this.getAllCustomers();
   }

  ngOnInit() {
    // Using Basic Interval
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
      });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAllCustomers(){
   this.config.getSecondHttp('all-customer','').then((data:any)=>{
     this.Customers =data.data;

     this.collectionSize = this.Customers.length
     console.log(data);
   })
  }

  DeleteCustomer(id:any){
    this.config.deleteSecondHttp('admin/users/'+id,'').then((data:any)=>{
      
      console.log(data);

      window.location.reload();
   
    this.toast.success('Customer Deleted Successfully!','Success')
    })
  }

  EditCustomer(a:any){
    console.log(a);
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/edit-customer'], navigationExtras);
  }
  openProfile(a:any){
    console.log(a);
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/customer-profile'], navigationExtras);
  }

  openChat(a:any){
    
    console.log(a);
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/chat'], navigationExtras);
    //this.router.navigate(['admin/chat'])
  }

    //Header functions
  
    logout(){
      this.shared.logOut();
    }
  
  
    changeLang(img:any,lang:any){}
}
