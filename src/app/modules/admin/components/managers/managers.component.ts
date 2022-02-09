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
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {

//

page1 = 1;
pageSize1 =20
collectionSize1 = 0;

  

  
  employeedata='';
  managerdata='';
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  Employees :any [ ]=[]
  Managers:any []=[]

  // Employees = [
  //   {
  //   image:'../../../../../assets/img/avatars/user1.png',
  //   name:"Marilyn Patel",
  //   designation:"Tiller",
  //   mobile:"(117)956-2052",
  //   email:"keanu.schneider@mail.com",
  //   date:"31/12/1972"
  // },
  // {
  //   image:'../../../../../assets/img/avatars/user2.png',
  //   name:"Steve Matthews",
  //   designation:"Electrician",
  //   mobile:"(117)956-2052",
  //   email:"frank.valdez@mail.com",
  //   date:"29/03/1978"
  // },
  // {
  //   image:'../../../../../assets/img/avatars/user3.png',
  //   name:"Natasha Wade",
  //   designation:"Carpenter",
  //   mobile:"(117)956-2052",
  //   email:"jasmine.sanders@mail.com",
  //   date:"22/04/2006"
  // },
  // {
  //   image:'../../../../../assets/img/avatars/user4.png',
  //   name:"Eugene Griffin",
  //   designation:"Tiller",
  //   mobile:"(117)956-2052",
  //   email:"louisa.lucas@mail.com",
  //   date:"18/06/1986"
  // },
  // {
  //   image:'../../../../../assets/img/avatars/user5.png',
  //   name:"Janice Lucas",
  //   designation:"Electrician",
  //   mobile:"(117)956-2052",
  //   email:"jacob.garrett@mail.com",
  //   date:"26/05/1966"
  // }

//]
  constructor(public config:ConfigService,public shared:SharedDataService,
    public toast:ToasterService,private http:HttpClient,
    private sanitizer: DomSanitizer,public router:Router) {
   
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

  getAllManagers(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
     this.http.get('https://cloneback.turnkey.no/api/admin/employees',{headers:headers}).subscribe((data:any)=>{
        
     console.log(data)
      for(let a =0;a<data[0].length;a++){
        if( data[0][a].designation_name == 'project manager'){
          console.log(data[0][a])
          this.Managers.push(data[0][a])
        }
        else{
         
        }
        
      }

    
      
       console.log(this.Managers.length)
       this.collectionSize1= this.Managers.length
     })
  }
 
 
  EditEmployee(a:any){
    console.log(a)
    let data=2
    let navigationExtras: NavigationExtras = {
      state: {
        user: a,
        data:data
      }
    };
    this.router.navigate(['admin/edit-manager'], navigationExtras);
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

  addPM(){
    let data=2
    let navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.router.navigate(['admin/add-manager'], navigationExtras);
  }

    //Header functions
  
    logout(){
      this.shared.logOut();
    }
  
  
    changeLang(img:any,lang:any){}

}
