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
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {


  imageSrc: string = '';


  // fullName = new FormControl('');
  // email = new FormControl('');
  // phone = new FormControl('');
  // gender = new FormControl('');
  // user_type = new FormControl(4);
  // designation = new FormControl('');
  // password = new FormControl('');
  // password_confirmation = new FormControl('');
  fullName = new FormControl('');
  email = new FormControl('');
  phone = new FormControl('');
  customerAddress = new FormControl('');
  projectLocation = new FormControl('');
  description = new FormControl('');
  user_type = new FormControl(4);
  designation = new FormControl(3);
  password = new FormControl('');
  password_confirmation = new FormControl('');


  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  file: any;
  fileSource: any;

  data: any;
  constructor(public router: Router, public shared: SharedDataService,
    public toast: ToasterService, private http: HttpClient,
    public config: ConfigService,
    public route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras.state?.user;
        localStorage.removeItem('CustomerID');
        localStorage.setItem('CustomerID', JSON.stringify(this.data));



      }

    });
    this.data = JSON.parse(localStorage.getItem('CustomerID') || '{}');
    console.log(this.data)
    this.viewCustomer()
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


  submit2() {
    console.log(this.email.value)
  }
  submit(filesrc: any) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    // if (this.fullName.value == '' || this.fullName.value == undefined || this.fullName.value == null) {
    //   this.toast.error('Customer name field is required!');
    //   return;
    // }
    // if (this.email.value == '' || this.email.value == undefined || this.email.value == null) {
    //   this.toast.error('Email field is required!');
    //   return;
    // }
    // if (this.phone.value == '' || this.phone.value == undefined || this.phone.value == null) {
    //   this.toast.error('Phone Number field is required!');
    //   return;
    // }


    // if (this.password.value != this.password_confirmation.value) {
    //   this.toast.error('Password doesnot match', 'Error')
    //   return;
    // }
    if (this.fullName.value == '' || this.fullName.value == undefined || this.fullName.value == null) {
      this.toast.error('Customer name field is required!');
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

    if (this.projectLocation.value == '' || this.projectLocation.value == undefined || this.projectLocation.value == null) {
      this.toast.error('Project Location is required!');
      return;
    }

    if (this.password.value == '' || this.password.value == undefined || this.password.value == null) {
      this.toast.error('password field is required!');
      return;
    }
    if (this.password_confirmation.value == '' || this.password_confirmation.value == undefined || this.password_confirmation.value == null) {
      this.toast.error('Password confirmation field is required!');
      return;
    }
    if (!re.test(this.email.value)) {
      this.toast.error('Wrong Email Format', 'Error')
      return;
    }
    if (this.password.value.length < 8) {
      this.toast.error('Password Length Too Short', 'Error')
      return;
    }
    if (this.password.value != this.password_confirmation.value) {
      this.toast.error('Password doesnot match', 'Error')
      return;
    }
    else {


      console.log(this.file)
      console.log(this.email.value)
      console.log(this.phone.value)
      console.log(this.user_type.value)
      console.log(this.designation.value)
      console.log(this.password.value)
      console.log(this.password_confirmation.value)


      if (this.data != undefined) {


        this.file = filesrc

        var myFormData = new FormData();
        const headers = new HttpHeaders();
        if (this.file != null) {


          if (this.password.value != '') {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
            // myFormData.append('last_name', this.lastname.value);
            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('project_location', this.projectLocation.value);
            myFormData.append('address', this.customerAddress.value);
            myFormData.append('description', this.description.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);


            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              // "first_name": this.firstname.value,
              // "last_name": this.lastname.value,
              "email": this.email.value,
              "phone": this.phone.value,
              "user_type": this.user_type.value,
              "designation_id": this.designation.value,
              "password": this.password.value,
              "password_confirmation": this.password_confirmation.value,
              "img": this.file
            }, { headers: headers }).subscribe(
              (data: any) => {
                this.router.navigate(['admin/customers'])
                this.toast.success('Customer Updated Successfully!', 'Success')

              }, (error: any) => {
                console.log('oops', error)
                this.toast.error(error.error.errors.email[0], 'Oops');
              });

          }

          else {

            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            // myFormData.append('first_name', this.firstname.value);
            // myFormData.append('last_name', this.lastname.value);
            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('project_location', this.projectLocation.value);
            myFormData.append('address', this.customerAddress.value);
            myFormData.append('description', this.description.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);




            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              // "first_name": this.firstname.value,
              // "last_name": this.lastname.value,
              "email": this.email.value,
              "phone": this.phone.value,
              "user_type": this.user_type.value,
              "designation_id": this.designation.value,

              "img": this.file
            }, { headers: headers }).subscribe(
              (data: any) => {
                this.router.navigate(['admin/customers'])
                this.toast.success('Customer Updated Successfully!', 'Success')

              }, (error: any) => {
                console.log('oops', error)
                this.toast.error(error.error.errors.email[0], 'Oops');
              }
            );

          }

        }
        else {


          if (this.password.value != '') {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            // myFormData.append('first_name', this.firstname.value);
            // myFormData.append('last_name', this.lastname.value);
            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('project_location', this.projectLocation.value);
            myFormData.append('address', this.customerAddress.value);
            myFormData.append('description', this.description.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);
            // myFormData.append('email', this.email.value);
            // myFormData.append('phone', this.phone.value);
            // myFormData.append('user_type', this.user_type.value);
            // myFormData.append('designation_id', this.designation.value);
            // myFormData.append('password', this.password.value);
            // myFormData.append('password_confirmation', this.password_confirmation.value);


            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              // "first_name": this.firstname.value,
              // "last_name": this.lastname.value,
              'first_name': this.fullName.value.substr(0, this.fullName.value.indexOf(' ')),
              'last_name': this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1),
              'email': this.email.value,
              'phone': this.phone.value,
              'project_location': this.projectLocation.value,
              'address': this.customerAddress.value,
              'description': this.description.value,
              'user_type': this.user_type.value,
              'designation_id': this.designation.value,
              'password': this.password.value,
              'password_confirmation': this.password_confirmation.value,
            }).subscribe(
              (data: any) => {
                this.router.navigate(['admin/customers'])
                this.toast.success('Customer Updated Successfully!', 'Success')

              }, (error: any) => {
                console.log('oops', error)
                this.toast.error(error.error.errors.email[0], 'Oops');
              });


          }
          else {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            // myFormData.append('first_name', this.firstname.value);
            // myFormData.append('last_name', this.lastname.value);
            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('project_location', this.projectLocation.value);
            myFormData.append('address', this.customerAddress.value);
            myFormData.append('description', this.description.value);
            myFormData.append('user_type', this.user_type.value);
            myFormData.append('designation_id', this.designation.value);
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);



            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              // "first_name": this.firstname.value,
              // "last_name": this.lastname.value,
              'first_name': this.fullName.value.substr(0, this.fullName.value.indexOf(' ')),
              'last_name': this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1),
              'email': this.email.value,
              'phone': this.phone.value,
              'project_location': this.projectLocation.value,
              'address': this.customerAddress.value,
              'description': this.description.value,
              'user_type': this.user_type.value,
              'designation_id': this.designation.value,
              'password': this.password.value,
              'password_confirmation': this.password_confirmation.value,

            }).subscribe((data: any) => {
              this.router.navigate(['admin/customers'])
              this.toast.success('Customer Updated Successfully!', 'Success')

            },
              (error: any) => {
                console.log('oops', error)

              }
            );




          }

        }
      }
      else {
        this.router.navigate(['admin/customers']);
        this.toast.error('Cannot Update Because User ID was not selected', 'Error')
      }
    }
  }
  cancel() {
    this.router.navigate(['admin/customers'])

  }




  onFileChange(event: any) {
    const reader = new FileReader();
    console.log(event.target.files[0].size);
    if (event.target.files[0].size < 2097152) {
      if (event.target.files && event.target.files.length) {
        this.file = event.target.files[0];
        reader.readAsDataURL(this.file);

        reader.onload = () => {

          this.imageSrc = reader.result as string;


          this.fileSource = reader.result


        };

      }
    }
    else {
      this.toast.error('Image Size is larger than 2mb');
    }
  }

  viewCustomer() {
    this.config.getSecondHttp('admin/users/' + this.data, '').then((data: any) => {
      console.log(data.data)
      this.imageSrc = data.data.img
      // this.firstname.setValue(data.data.first_name)
      this.fullName.setValue((data.data.first_name != null) ? data.data.first_name : '');
      this.fullName.setValue(this.fullName.value + ' ' + data.data.last_name);
      this.email.setValue(data.data.email);
      this.description.setValue(data.data.description);
      this.customerAddress.setValue(data.data.address);
      this.projectLocation.setValue(data.data.project_location);
      this.phone.setValue(data.data.phone)
      this.designation.setValue(data.data.designation_id)
    })
  }

  //Header Functions
  logout() {
    this.shared.logOut();
  }
  changeLang(img: any, lang: any) { }

}


