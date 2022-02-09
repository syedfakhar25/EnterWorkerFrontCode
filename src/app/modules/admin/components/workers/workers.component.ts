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
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {

//
page = 1;
pageSize = 20
collectionSize = 0;

page1 = 1;
pageSize1 = 5
collectionSize1 = 0;

  

  
  workerdata='';
 
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  workers:any[]=[]
  Workers :any [ ]=[]
  

  
  constructor(public config:ConfigService,public toast:ToasterService,private http:HttpClient,
    public shared:SharedDataService,
    private sanitizer: DomSanitizer,public router:Router) {
    this.getAllWorkers();
    
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

  getAllWorkers(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
     this.http.get('https://cloneback.turnkey.no/api/admin/company',{headers:headers}).subscribe((data:any)=>{
     this.workers = data[0]
        // console.log(this.workers)
      }

     )
  }
 
  EditWorker(a:any){
    console.log(a)
    
    let navigationExtras: NavigationExtras = {
      state: {
        user: a,
        
      }
    };
    this.router.navigate(['admin/edit-worker'], navigationExtras);
  }

  DeleteWorker(id:any){
    this.config.deleteSecondHttp('admin/company/'+id,'').then((data:any)=>{
    this.getAllWorkers();

    this.toast.success('Company Worker Record Deleted Successfully!','Succcess')
    })
  }
  openProfile(a:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/worker-profile'], navigationExtras);
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
  }

  addWorker(){
   
  
    this.router.navigate(['admin/add-worker']);
  }
  
    logout(){
      this.shared.logOut();
    }
    
  
    changeLang(img:any,lang:any){}

}
