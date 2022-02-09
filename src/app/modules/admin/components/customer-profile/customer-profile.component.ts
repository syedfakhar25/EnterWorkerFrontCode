import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { ConfigService } from 'src/providers/config/config.service';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {


  imageSrc: string = '';

  firstname = new FormControl('');
  lastname = new FormControl('');
  email = new FormControl('');
  phone = new FormControl('');
  gender = new FormControl('');


  progress = 10;
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
  collectionSize2 = 0;
  //

  Projects: any[] = []
  data: any;

  Data: any[] = []
  constructor(public router: Router, public toast: ToasterService,
    public shared:SharedDataService,
    private http:HttpClient,
    public route: ActivatedRoute, public config: ConfigService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras.state?.user;

        localStorage.removeItem('customerID');
        localStorage.setItem('customerID', JSON.stringify(this.data));

      }

    });
    this.data = JSON.parse(localStorage.getItem('customerID') || '{}');
    this.getcustomerDetails()
    this.getCustomerProjects()
    this.getcustomerTotalProjects()
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

  checkImg(b: any) {
    console.log(b);
  }

  getcustomerDetails() {
    this.config.getSecondHttp('admin/users/' + this.data, '').then((data: any) => {
      this.Data = data.data
      console.log(data.data)
      this.imageSrc = data.data.img
      this.firstname.setValue(data.data.first_name)
      this.lastname.setValue(data.data.last_name)
      this.email.setValue(data.data.email)
      this.phone.setValue(data.data.phone)
      this.gender.setValue(data.data.gender)

    })
  }

  getCustomerProjects() {
    // this.config.getSecondHttp('customer/total-projects/' + this.data, '').then((data: any) => {

    //   this.Projects = data.data

    //   for (let i = 0; i < this.Projects.length; i++) {

    //     var date1 = new Date(this.Projects[i].start_date);
    //     var date2 = new Date(this.Projects[i].end_date);

    //     var Difference_In_Time = date2.getTime() - date1.getTime();
    //     var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    //     console.log(Difference_In_Days);

    //     this.Projects[i].workingdays = Difference_In_Days;

    //   }


    //   console.log(this.Projects)

    // })
  }


  openChat(a: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/chat'], navigationExtras);
  }

  openDetails(a: any) {
    console.log(a)
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/project-details'], navigationExtras);
  }


  getcustomerTotalProjects() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/customer/total-projects/' + this.data, { headers: headers }).subscribe((data: any) => {

      console.log(data)
      this.Projects = data[0];
      for (let i = 0; i < this.Projects.length; i++) {

        var date1 = new Date(this.Projects[i].start_date);
        var date2 = new Date(this.Projects[i].end_date);

        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        console.log(Difference_In_Days);

        this.Projects[i].workingdays = Difference_In_Days;

      }
     
    })



  }

    //Header Functions
    logout(){
      this.shared.logOut();
    }
    changeLang(img:any,lang:any){}
}

