import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.component.html',
  styleUrls: ['./add-worker.component.css']
})
export class AddWorkerComponent implements OnInit {

 
  imageSrc: string = '';
  formData = new FormGroup({
    companyName: new FormControl(''),
    organizationNumber: new FormControl(''),
    companyAddress: new FormControl(''),
    companyMailingAddress: new FormControl(''),
    companyContactNumber: new FormControl(''),
    // gender: new FormControl(''),
    // user_type: new FormControl(5),
    // designation: new FormControl(''),
    password: new FormControl(''),
    password_confirmation: new FormControl(''),
    workerFullName: new FormControl(''),
    workerEmail: new FormControl(''),
    workerContact: new FormControl('')
  });
  

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

file:any;
fileSource:any;

Designations:any[]=[]
  
data:any;
  constructor(public router:Router,public shared:SharedDataService,
    public route:ActivatedRoute, public toast:ToasterService,private http:HttpClient) {
    
    
    
    this.getDesignations()
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

  submit(){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
  
  //  if(this.formData.value.firstname == '' || this.formData.value.firstname == undefined || this.formData.value.firstname == null){
  //   this.toast.error('First name field is required!');
  //   return;
  //  }
   if(this.formData.value.companyName == '' || this.formData.value.companyName == undefined || this.formData.value.companyName == null){
    this.toast.error('Company name field is required!');
    return;
   }
   if(this.formData.value.companyMailingAddress == '' || this.formData.value.companyMailingAddress == undefined || this.formData.value.companyMailingAddress == null){
    this.toast.error('Company Mailing Address field is required!');
    return;
   }
   if(this.formData.value.companyContactNumber == '' || this.formData.value.companyContactNumber == undefined || this.formData.value.companyContactNumber == null){
    this.toast.error('Phone Number field is required!');
    return;
   }
   if(this.formData.value.organizationNumber == '' || this.formData.value.organizationNumber == undefined || this.formData.value.organizationNumber == null){
    this.toast.error('Organization Number field is required!');
    return;
   }
  //  if(this.formData.value.gender == '' || this.formData.value.gender == undefined || this.formData.value.gender == null){
  //   this.toast.error('Gender field is required!');
  //   return;
  //  }
  
   if(this.formData.value.password == '' || this.formData.value.password == undefined || this.formData.value.password == null){
    this.toast.error('password field is required!');
    return;
   }
   if(this.formData.value.password_confirmation == '' || this.formData.value.password_confirmation == undefined || this.formData.value.password_confirmation == null){
    this.toast.error('Password confirmation field is required!');
    return;
   }
   if (!re.test(this.formData.value.companyMailingAddress)){
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
  else{
   

    if(this.file == undefined || this.file == null){
      var myFormData = new FormData();
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      // myFormData.append('img', this.file);
      myFormData.append('name', this.formData.value.companyName);
      myFormData.append('organization_number', this.formData.value.organizationNumber);
      myFormData.append('address', this.formData.value.companyAddress);
      myFormData.append('contact_number', this.formData.value.companyContactNumber);
      myFormData.append('email', this.formData.value.companyMailingAddress);
      myFormData.append('password', this.formData.value.password);
      myFormData.append('confirm_password', this.formData.value.password_confirmation);
      myFormData.append('manager_name', this.formData.value.workerFullName);
      myFormData.append('manager_email', this.formData.value.workerEmail);
      myFormData.append('manager_phone', this.formData.value.workerContact);
      console.log('myFormData', myFormData);      
      console.log('formData', this.formData);      
      // / Image Post Request /
      this.http.post('https://cloneback.turnkey.no/api/admin/company', myFormData, {
      headers: headers
      }).subscribe(data => {
        this.router.navigate(['admin/workers'])
       this.toast.success('Company Worker Added Successfully!','Success')
      },
      (error: any) => {
        console.log('oops', error)
      //  this.toast.error(error.error.errors.email[0], 'Oops');
      }
    );  
    }
    
    


     else{
    
      var myFormData = new FormData();
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      myFormData.append('image', this.file);
      // myFormData.append('first_name', this.formData.value.firstname);
      myFormData.append('name', this.formData.value.companyName);
      myFormData.append('organization_number', this.formData.value.organizationNumber);
      myFormData.append('address', this.formData.value.companyAddress);
      myFormData.append('contact_number', this.formData.value.companyContactNumber);
      myFormData.append('email', this.formData.value.companyMailingAddress);
      myFormData.append('password', this.formData.value.password);
      myFormData.append('confirm_password', this.formData.value.password_confirmation);
      myFormData.append('manager_name', this.formData.value.workerFullName);
      myFormData.append('manager_email', this.formData.value.workerEmail);
      myFormData.append('manager_phone', this.formData.value.workerContact);
      
      
      // / Image Post Request /
      this.http.post('https://cloneback.turnkey.no/api/admin/company', myFormData, {
      headers: headers
      }).subscribe(data => {
        this.router.navigate(['admin/workers'])
        this.toast.success('Company Worker Added Successfully!','Success')
      },
      (error: any) => {
        console.log('oops', error)
      //  this.toast.error(error.error.errors.email[0], 'Oops');
      }
    );  
    }
    
 
 
  
  }
  }
  cancel(){
    this.router.navigate(['admin/workers'])
    
  }

 


  onFileChange(event:any) {
    const reader = new FileReader();
    
    if(event.target.files[0].size < 2097152){
    if(event.target.files && event.target.files.length) {
     this.file = event.target.files[0];
      reader.readAsDataURL(this.file);
    
      reader.onload = () => {
   
        this.imageSrc = reader.result as string;
     
       
          this.fileSource= reader.result
       
        
      };
      
    }

  }

  else{
    this.toast.error('Image Size is larger than 2mb');
  }
  }
 


  getDesignations(){

    // this.config.getHttp('admin/designations','').then((data:any)=>{
    //   console.log(data)
    // })

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    this.http.get('https://cloneback.turnkey.no/api/admin/designations', {
      headers: headers
      }).subscribe((data:any) => {
        console.log(data)
       
        for(let a=0;a<data[0].length;a++){
          if(data[0][a].designation_name == 'super admin' || data[0][a].designation_name == 'customer'){
           
          }
          else{
           
            
              if(data[0][a].designation_name == 'company worker'){
                this.Designations.push(data[0][a])
              }
            
           
        }
      }
       
       
      
      },
      (error: any) => {
        console.log('oops', error)
        
      }
    );  
    
  }

  //Header Functions
  logout(){
    this.shared.logOut();
  }
  changeLang(img:any,lang:any){}
}
