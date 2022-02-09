import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  role: any;
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();


  clientname = new FormControl('');
  managername = new FormControl('');
  formData = {
    projectname: '',


    startdate: '',
    enddate: '',
    projectdesc: '',
    street: '',
    city: '',
    postalcode: '',
    customer_id: null,
    manager_id: null
  }
  data: any;
  AllCustomers: any[] = [];
  AllManagers: any[] = [];
  constructor(public router: Router, private http: HttpClient,
    public shared: SharedDataService, public route: ActivatedRoute, public config: ConfigService, public toast: ToasterService) {

    this.role = this.shared.role;
    console.log(this.role);
    console.log(this.shared.customerData.user_type)
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras.state?.user;
        localStorage.removeItem('ProjectID');
        localStorage.setItem('ProjectID', JSON.stringify(this.data));



      }


    });

    this.data = JSON.parse(localStorage.getItem('ProjectID') || '{}');
    this.fetchAllCustomers();
    //  this.fetchAllManagers()
    this.viewProject()
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

  submit() {


    if (this.formData.projectname == '' || this.formData.projectname == null || this.formData.projectname == undefined) {
      this.toast.warning('Project Name is missing', 'Error')
      return;
    }
    if (this.clientname.value == '' || this.clientname.value == null || this.clientname.value == undefined) {
      this.toast.warning('Client Name is missing', 'Error')
      return;
    }

    if (this.formData.startdate == '' || this.formData.startdate == null || this.formData.startdate == undefined) {
      this.toast.warning('Start Date is missing', 'Error')
      return;
    }
    if (this.formData.enddate == '' || this.formData.enddate == null || this.formData.enddate == undefined) {
      this.toast.warning('End Date is missing', 'Error')
      return;
    }
    if (this.formData.projectdesc == '' || this.formData.projectdesc == null || this.formData.projectdesc == undefined) {
      this.toast.warning('Project Description is missing', 'Error')
      return;
    }
    if (this.formData.street == '' || this.formData.street == null || this.formData.street == undefined) {
      this.toast.warning('Street Address is missing', 'Error')
      return;
    }

    if (this.formData.postalcode == '' || this.formData.postalcode == null || this.formData.postalcode == undefined) {
      this.toast.warning('Postal Code is missing', 'Error')
      return;
    }
    if (this.formData.city == '' || this.formData.city == null || this.formData.city == undefined) {
      this.toast.warning('City is missing', 'Error')
      return;
    }

    var d1 = new Date(this.formData.startdate);
    var d2 = new Date(this.formData.enddate);

    if (d1.getTime() > d2.getTime()) {
      this.toast.warning('Project End Date Cannot Be Greater Than Start Date!', 'Error')
      return;
    }

    else {

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.put('https://cloneback.turnkey.no/api/manager/projects/' + this.data, {
        "customer_id": this.formData.customer_id,
        "name": this.formData.projectname,

        "description": this.formData.projectdesc,
        "street": this.formData.street,
        "postal_code": this.formData.postalcode,
        "city": this.formData.city,
        "start_date": this.formData.startdate,
        "end_date": this.formData.enddate
      }, { headers: headers }).subscribe((data: any) => {



        console.log(data)
        this.router.navigate(['admin/projects'])
        this.toast.success('Project has been added successfully!', 'Success')
      })



    }


  }
  cancel() {
    this.router.navigate(['admin/employees'])

  }

  fetchAllCustomers() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/all-customer',
      { headers: headers }).subscribe((data: any) => {


        this.AllCustomers = data.data

      })
  }
  fetchAllManagers() {
    this.config.getSecondHttp('all-manager', '').then((data: any) => {
      this.AllManagers = data.data



    })
  }

  SelectClient(a: any) {
    this.formData.customer_id =a;
  }

  SelectManager(a: any) {

    console.log(a);
    var i = 0
    for (i; i < this.AllManagers.length; i++) {
      if (this.AllManagers[i].first_name == a) {

        this.formData.manager_id = this.AllManagers[i].id;
      }
    }

  }

  viewProject() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/manager/projects/' + this.data, { headers: headers }).subscribe((data: any) => {



      console.log(data.data);


      this.formData.projectname = data.data.name;
      this.clientname.setValue(data.data.customer.first_name);
      if (data.data.manager != null) {
        this.managername.setValue(data.data.manager.first_name)
      }
      this.formData.customer_id = data.data.customer_id;
      this.formData.manager_id = data.data.manager_id;
      this.formData.startdate = data.data.start_date;
      this.formData.enddate = data.data.end_date;
      this.formData.projectdesc = data.data.description;
      this.formData.street = data.data.street;
      this.formData.postalcode = data.data.postal_code;
      this.formData.city = data.data.city;

    })
  }

   //Header functions
  
 logout(){
   this.shared.logOut()
 }


 changeLang(img:any,lang:any){}
}
