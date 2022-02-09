import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import {ConfigService } from '../../../../../providers/config/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit,OnDestroy {


//
page = 1;
pageSize = 20
collectionSize = 0;

page1 = 1;
pageSize1 = 5
collectionSize1 = 0;

  

  
  employeedata='';
  managerdata='';
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  employees:any[]=[]
  Employees :any [ ]=[]
  Managers:any []=[]

  role:any
  constructor(public config:ConfigService,public toast:ToasterService,private http:HttpClient,
    public shared:SharedDataService,
    private sanitizer: DomSanitizer,public router:Router) {
   this.role = this.shared.role
      if(this.role == 'admin'){
        this.getAllEmployees();
      }
    else if(this.role == 'company worker'){
      this.getAllCTEmployees();
    }
    this.getAllManagers();
   }
   public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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

  getAllEmployees(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
     this.http.get('https://cloneback.turnkey.no/api/admin/employees',{headers:headers}).subscribe((data:any)=>{
        
     console.log(data)
      for(let a =0;a<data[0].length;a++){
        if(data[0][a].designation_name == 'super admin' || data[0][a].designation_name == 'customer' 
        || data[0][a].designation_name == 'project manager' || data[0][a].designation_name == 'company worker'){
         
        }
        else{
          console.log(data[0][a])
          this.Employees.push(data[0][a])
        }
        
      }

      this.employees = this.Employees;

      console.log(this.employees)
      
       console.log(this.Employees.length)
       this.collectionSize1= this.Employees.length
     })
  }
  getAllManagers(){
    this.config.getSecondHttp('all-manager','').then((data:any)=>{
    
      this.Managers=data.data
      
    })
 }
  EditEmployee(a:any){
    console.log(a)
    let data=3
    let navigationExtras: NavigationExtras = {
      state: {
        user: a,
        data:data,
      }
    };
    this.router.navigate(['admin/edit-employee'], navigationExtras);
  }

  DeleteEmployee(id:any){
    this.config.deleteSecondHttp('admin/users/'+id,'').then((data:any)=>{
    window.location.reload();

    this.toast.success('Employee Record Deleted Successfully!','Succcess')
    })
  }
  openProfile(a:any){

    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/employee-profile'], navigationExtras);
  }

  refreshCountries() {
 
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

  addEmployee(){
    let data=3
    let navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.router.navigate(['admin/add-employee'], navigationExtras);
  }

    //Header functions
  
    logout(){
      this.shared.logOut();
    }
  
  
    changeLang(img:any,lang:any){}


    //Company worker functions
    getAllCTEmployees(){
      const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
     this.http.get('https://cloneback.turnkey.no/api/company/get-company-worker-employees/'+this.shared.customerData.id,{headers:headers}).subscribe((data:any)=>{
console.log(data)

this.employees= data.data
    })
    }
}
