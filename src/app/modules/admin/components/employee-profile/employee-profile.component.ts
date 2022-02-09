import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { ConfigService } from 'src/providers/config/config.service';
import { FormControl } from '@angular/forms';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {

  
  imageSrc: string = '';

  firstname = new FormControl('');
  lastname = new FormControl('');
  email = new FormControl('');
  phone = new FormControl('');
  gender = new FormControl('');
  user_type = new FormControl(3);
  designation = new FormControl('');
  joining_date = new FormControl('')

role:any;
  progress =10;
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

//Modal Service//
closeResult: string = '';

//
//pagination//
  
page = 1;
pageSize = 5
collectionSize = 0;


page1 = 1;
pageSize1 = 5
collectionSize1 = 0;


page2 = 1;
pageSize2 = 5
collectionSize2= 0;
//

  Tasks:any[] = []
  data: any;


  Data:any[]=[];
  constructor(public router: Router, public toast: ToasterService, private http:HttpClient,
    public route: ActivatedRoute,public config:ConfigService,public shared:SharedDataService) {
      this.role= this.shared.role;
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation()?.extras.state) {
          this.data = this.router.getCurrentNavigation()?.extras.state?.user;
          localStorage.removeItem('EmployeeID');
          localStorage.setItem('EmployeeID', JSON.stringify(this.data));
          
  
        }
       
      });
      this.data = JSON.parse(localStorage.getItem('EmployeeID')||'{}');
      this.getEmployeeDetails()

     


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

  checkImg(b:any){
//console.log(b);
  }

  getEmployeeDetails(){
    this.config.getSecondHttp('admin/users/'+this.data,'').then((data:any)=>{
      console.log(data.data)
      this.Data = data.data;
      this.imageSrc = data.data.img
      this.firstname.setValue(data.data.first_name)
      this.lastname.setValue(data.data.last_name)
      this.email.setValue(data.data.email)
      this.phone.setValue(data.data.phone)
      this.gender.setValue(data.data.gender)
      this.designation.setValue(data.data.designation)
      this.joining_date.setValue(data.data.created_at)
     
      console.log(this.role)
      if(this.designation.value != 'project manager'){
        this.getTasksforEmployee()
      }
     else if(this.designation.value == 'project manager'){
      this.getManagerProjects()
     }
    })
  }



  Projects:any[]=[]

  getTasksforEmployee(){
   

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.get('https://cloneback.turnkey.no/api/employee/total-tasks/' + this.data, { headers: headers }).subscribe((data: any) => {
        console.log(data[0].projects)
       this.Projects = data[0].projects
       
      })
     
    
  }

  getManagerProjects(){
    this.config.getSecondHttp('manager/get-manager-projects/' + this.data, '').then((data: any) => {
      console.log(data)
      this.Projects = data.data;
      console.log(data.data)
    })
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


  openDetails(a: any) {
//    console.log(a)
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/project-details'], navigationExtras);
  }



  // 

    //Header Functions
    logout(){
      this.shared.logOut();
    }
    changeLang(img:any,lang:any){}
}
