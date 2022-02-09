import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  role: any

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  imageSrc = ''
  file: any;
  fileSource: any;
  firstname = new FormControl('');
  lastname = new FormControl('');
  email = new FormControl('');
  phone = new FormControl('');
  gender = new FormControl('');
  user_type = new FormControl();
  designation = new FormControl(0);
  password = new FormControl('');
  password_confirmation = new FormControl('');
  Designations: any[] = [];
  constructor(public router: Router,
    public shared: SharedDataService,
    public toast: ToasterService,
    public http: HttpClient,
    public config: ConfigService) {
    this.role = this.shared.role;
    this.imageSrc = this.shared.customerData.img
    this.firstname.setValue(this.shared.customerData.first_name)
    this.lastname.setValue(this.shared.customerData.last_name)
    this.email.setValue(this.shared.customerData.email)
    this.phone.setValue(this.shared.customerData.phone)
    this.gender.setValue(this.shared.customerData.gender)
    this.user_type.setValue(this.shared.customerData.user_type)
    console.log(this.shared.customerData.designation_id)
   
      this.designation.setValue(this.shared.customerData.designation_id);
    
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

  submit(filesrc: any) {
    //  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (this.firstname.value == '' || this.firstname.value == undefined || this.firstname.value == null) {
      this.toast.error('First name field is required!');
      return;
    }
    if (this.lastname.value == '' || this.lastname.value == undefined || this.lastname.value == null) {
      this.toast.error('Last name field is required!');
      return;
    }
    if (this.email.value == '' || this.email.value == undefined || this.email.value == null) {
      this.toast.error('Email field is required!');
      return;
    }
    if (this.phone.value == '' || this.phone.value == undefined || this.phone.value == null) {
      this.toast.error('Phone Number field is required!');
      return;
    }
    // if (this.role == 'employee' || this.role == 'project manager') {
    //   if (this.designation.value == '' || this.designation.value == undefined || this.designation.value == null) {
    //     this.toast.error('Designation field is required!');
    //     return;
    //   }
    // }

    if (this.gender.value == '' || this.gender.value == undefined || this.gender.value == null) {
      this.toast.error('Gender field is required!');
      return;
    }

    // if (this.password.value == '' || this.password.value == undefined || this.password.value == null) {
    //   this.toast.error('password field is required!');
    //   return;
    // }
    // if (this.password_confirmation.value == '' || this.password_confirmation.value == undefined || this.password_confirmation.value == null) {
    //   this.toast.error('Password confirmation field is required!');
    //   return;
    // }
    // if (!re.test(this.email.value)) {
    //   this.toast.error('Wrong Email Format', 'Error')
    //   return;
    // }
    // if (this.password.value.length < 8) {
    //   this.toast.error('Password Length Too Short', 'Error')
    //   return;
    // }
    if (this.password.value != this.password_confirmation.value) {
      this.toast.error('Password doesnot match', 'Error')
      return;
    }
    else {

      console.log(this.designation.value)



      if (filesrc != null || filesrc != undefined || filesrc != '') {

        if (this.role == 'admin') {
          // this.designation.setValue('super admin')
        }
        this.file = filesrc

        var myFormData = new FormData();
        const headers = new HttpHeaders();
        if (this.file != null) {

          if (this.password.value != '') {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            myFormData.append('first_name', this.firstname.value);
            myFormData.append('last_name', this.lastname.value);
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);

            / Image Post Request /
            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.shared.customerData.id, {
              "first_name": this.firstname.value,
              "last_name": this.lastname.value,
              "email": this.email.value,
              "phone": this.phone.value,
              "gender": this.gender.value,
              "user_type": this.user_type.value,
              "designation_id": this.designation.value,
              "password": this.password.value,
              "password_confirmation": this.password_confirmation.value,
              "img": this.file
            }, { headers: headers }).subscribe(  ( data:any )=>{
              console.log(data)
              // localStorage.removeItem('Users');
              // this.shared.addUser(data.data);
              // window.location.reload();
              this.toast.success('User Updated Successfully!', 'Success')
             
           },
            (error:any) =>{
              console.log('oops', error)
             
            } 
           
          );

          }
          else {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            myFormData.append('first_name', this.firstname.value);
            myFormData.append('last_name', this.lastname.value);
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);


            / Image Post Request /
            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.shared.customerData.id, {
              "first_name": this.firstname.value,
              "last_name": this.lastname.value,
              "email": this.email.value,
              "phone": this.phone.value,
              "gender": this.gender.value,
              "user_type": this.user_type.value,
              "designation_id": this.designation.value,

              "img": this.file
            }, { headers: headers }).subscribe(  ( data:any )=>{

              console.log(data)
              localStorage.removeItem('Users');
              this.shared.addUser(data[0]);
              window.location.reload();
              this.toast.success('User Updated Successfully!', 'Success')
             
           },
           (error:any) =>{
            console.log('oops', error)
           
          } 
           
          );
          }
        }

        else{
         
          if (this.password.value != '') {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
    
            myFormData.append('first_name', this.firstname.value);
            myFormData.append('last_name', this.lastname.value);
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);
    
            / Image Post Request /
            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.shared.customerData.id, {
              "first_name": this.firstname.value,
              "last_name": this.lastname.value,
              "email": this.email.value,
              "phone": this.phone.value,
              "gender": this.gender.value,
              "user_type": this.user_type.value,
              "designation_id": this.designation.value,
              "password": this.password.value,
              "password_confirmation": this.password_confirmation.value         
            }, { headers: headers }).subscribe(
             ( data:any )=>{
              console.log(data)
              localStorage.removeItem('Users');
              this.shared.addUser(data[0]);
              window.location.reload();
                this.toast.success('User Updated Successfully!', 'Success')
               
             },
             (error:any) =>{
              console.log('oops', error)
             
            } 
             
            );
             
            
          }

          else{
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
    
            myFormData.append('first_name', this.firstname.value);
            myFormData.append('last_name', this.lastname.value);
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);

    
            / Image Post Request /
            this.http.put<any>('https://cloneback.turnkey.no/api/admin/users/' + this.shared.customerData.id, {
              "first_name": this.firstname.value,
              "last_name": this.lastname.value,
              "email": this.email.value,
              "phone": this.phone.value,
              "gender": this.gender.value,
              "user_type": this.user_type.value,
               "designation_id": this.designation.value
            }, { headers: headers }).
            subscribe(
              ( data:any )=>{
                console.log(data[0])
              localStorage.removeItem('Users');
              this.shared.addUser(data[0]);
              window.location.reload();
                this.toast.success('User Updated Successfully!', 'Success')
               
             },
             (error:any) =>{
              console.log('oops', error)
                        
            } 
             
            );


          
          }
         
        }
        
       
      }
      
    }

  }


cancel(){
  this.router.navigate(['admin/home'])

}

onFileChange(event: any) {
  const reader = new FileReader();
  console.log(event.target.files[0].size);
  if(event.target.files[0].size < 2097152){
  if (event.target.files && event.target.files.length) {
    this.file = event.target.files[0];
    reader.readAsDataURL(this.file);

    reader.onload = () => {

      this.imageSrc = reader.result as string;


      this.fileSource = reader.result


    };

  }
}
else{
  this.toast.error('Image Size is larger than 2mb');
}
}
extractErrorMessagesFromErrorResponse(errorResponse: HttpErrorResponse) {
  throw new Error('Function not implemented.');
}
 
}


