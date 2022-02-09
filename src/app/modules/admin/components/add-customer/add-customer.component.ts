import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  
  imageSrc: string = '';
  file:any;
fileSource:any;

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  formData = new FormGroup({
    fullName: new FormControl(''),
    // lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    customerAddress: new FormControl(''),
    projectLocation: new FormControl(''),
    description: new FormControl(''),
    user_type: new FormControl(4),
    designation: new FormControl(3),
    password: new FormControl(''),
    password_confirmation: new FormControl(''),
  });

  
  constructor(public router:Router,
    public shared:SharedDataService,
    public toast:ToasterService,private http:HttpClient) { }

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

  submit(){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
  
   if(this.formData.value.fullName == '' || this.formData.value.fullName == undefined || this.formData.value.fullName == null){
    this.toast.error('Customer name field is required!');
    return;
   }
  //  if(this.formData.value.lastname == '' || this.formData.value.lastname == undefined || this.formData.value.lastname == null){
  //   this.toast.error('Last name field is required!');
  //   return;
  //  }
   if(this.formData.value.email == '' || this.formData.value.email == undefined || this.formData.value.email == null){
    this.toast.error('Email field is required!');
    return;
   }
   if(this.formData.value.phone == '' || this.formData.value.phone == undefined || this.formData.value.phone == null){
    this.toast.error('Phone Number field is required!');
    return;
   }
  
   if(this.formData.value.projectLocation == '' || this.formData.value.projectLocation == undefined || this.formData.value.projectLocation == null){
    this.toast.error('Project Location is required!');
    return;
   }
  
   if(this.formData.value.password == '' || this.formData.value.password == undefined || this.formData.value.password == null){
    this.toast.error('password field is required!');
    return;
   }
   if(this.formData.value.password_confirmation == '' || this.formData.value.password_confirmation == undefined || this.formData.value.password_confirmation == null){
    this.toast.error('Password confirmation field is required!');
    return;
   }
   if (!re.test(this.formData.value.email)){
    this.toast.error('Wrong Email Format','Error')
    return;
  }
  if(this.formData.value.password.length <8){
    this.toast.error('Password Length Too Short','Error')
    return;
  }
  if(this.formData.value.password != this.formData.value.password_confirmation){
    this.toast.error('Password doesnot match','Error')
    return;
  }
  if(this.fileSource == null){
   
    var myFormData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    myFormData.append('first_name', this.formData.value.fullName.substr(0,this.formData.value.fullName.indexOf(' ')));
    myFormData.append('last_name', this.formData.value.fullName.substr(this.formData.value.fullName.indexOf(' ')+1));
    myFormData.append('email', this.formData.value.email);
    myFormData.append('phone', this.formData.value.phone);
    myFormData.append('project_location', this.formData.value.projectLocation);
    myFormData.append('address', this.formData.value.customerAddress);
    myFormData.append('description', this.formData.value.description);
    myFormData.append('gender', this.formData.value.gender);
    myFormData.append('user_type', this.formData.value.user_type);
    myFormData.append('designation_id', this.formData.value.designation);
    myFormData.append('password', this.formData.value.password);
    myFormData.append('password_confirmation', this.formData.value.password_confirmation);
    
    
    // / Image Post Request /
    this.http.post('https://cloneback.turnkey.no/api/admin/users', myFormData, {
    headers: headers
    }).subscribe((data) => {
      this.router.navigate(['admin/customers'])
     this.toast.success('Customer Added Successfully!','Success')
    },
    (error: any) => {
      console.log('oops', error)
    //  this.toast.error(error.error.errors.email[0], 'Oops');
    }
  );  
  }
  else{
    
    console.log(this.formData.value);
    console.log(this.file);
    var myFormData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    myFormData.append('img', this.file);
    myFormData.append('first_name', this.formData.value.fullName.substr(0,this.formData.value.fullName.indexOf(' ')));
      myFormData.append('last_name', this.formData.value.fullName.substr(this.formData.value.fullName.indexOf(' ')+1));
    myFormData.append('email', this.formData.value.email);
    myFormData.append('project_location', this.formData.value.projectLocation);
    myFormData.append('address', this.formData.value.customerAddress);
    myFormData.append('description', this.formData.value.description);
    myFormData.append('phone', this.formData.value.phone);
    myFormData.append('gender', this.formData.value.gender);
    myFormData.append('user_type', this.formData.value.user_type);
    myFormData.append('designation_id', this.formData.value.designation);
    myFormData.append('password', this.formData.value.password);
    myFormData.append('password_confirmation', this.formData.value.password_confirmation);
    
    
    // / Image Post Request /
    this.http.post('https://projectback.turnkey.no/api/admin/users', myFormData, {
    headers: headers
    }).subscribe((data) => {
      console.log(data)
      this.router.navigate(['admin/customers'])
     this.toast.success('Customer Added Successfully!','Success')
    },
    (error: any) => {
      console.log('oops', error)
     // this.toast.error(error.error.errors.email[0], 'Oops');
    }
  );  
 
 
  
  }
  }
  cancel(){
    this.router.navigate(['admin/customers'])
    
  }

 


  onFileChange(event:any) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
     this.file = event.target.files[0];
      reader.readAsDataURL(this.file);
    
      reader.onload = () => {
   
        this.imageSrc = reader.result as string;
     
       
          this.fileSource= reader.result
       
        
      };
      
    }
  }

    //Header Functions
    logout(){
      this.shared.logOut();
    }
    changeLang(img:any,lang:any){}

}
