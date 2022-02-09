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
  selector: 'app-edit-manager',
  templateUrl: './edit-manager.component.html',
  styleUrls: ['./edit-manager.component.css']
})
export class EditManagerComponent implements OnInit {


  imageSrc: string = '';

  firstname = new FormControl('');
  lastname = new FormControl('');
  fullName = new FormControl('');
  email = new FormControl('');
  phone = new FormControl('');
  gender = new FormControl('');
  manager_type = new FormControl();
  description = new FormControl();
  user_type = new FormControl();
  designation = new FormControl('');
  password = new FormControl('');
  password_confirmation = new FormControl('');
  manager_types = [
    { id: 1, value: 'Economy' },
    { id: 2, value: 'Architecture' },
    { id: 3, value: 'Builder' },
    { id: 4, value: 'Appraiser' },
  ]


  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  file: any;
  fileSource: any;

  data: any;

  Designations: any[] = []

  userType: any;
  constructor(public router: Router, public shared: SharedDataService,
    public toast: ToasterService, private http: HttpClient,
    public route: ActivatedRoute, public config: ConfigService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras.state?.user;
        localStorage.removeItem('EmployeeID');
        localStorage.setItem('EmployeeID', JSON.stringify(this.data));
        this.userType = this.router.getCurrentNavigation()?.extras.state?.data;
        localStorage.removeItem('UserType');
        localStorage.setItem('UserType', JSON.stringify(this.userType));


      }

    });
    this.data = JSON.parse(localStorage.getItem('EmployeeID') || '{}');
    if (localStorage.getItem('UserType')) {
      this.userType = JSON.parse(localStorage.getItem('UserType') || '{}');
    }

    this.getEmployeeDetails()
    this.getDesignations()
    console.log(this.data)

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



    // if (this.firstname.value == '' || this.firstname.value == undefined || this.firstname.value == null) {
    //   this.toast.error('Manager name field is required!');
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

    // if(this.manager_type.value == '' || this.manager_type.value == undefined || this.manager_type.value == null){
    //   this.toast.error('Manage Type is required');
    //   return;
    //  }
    // if (this.password.value != this.password_confirmation.value) {
    //   this.toast.error('Password doesnot match', 'Error')
    //   return;
    // }
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (this.fullName.value == '' || this.fullName.value == undefined || this.fullName.value == null) {
      this.toast.error('Manager name field is required!');
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
    if (this.manager_type.value == '' || this.manager_type.value == undefined || this.manager_type.value == null) {
      this.toast.error('Manage Type is required');
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

      if (this.designation.value == 'project manager') {
        this.user_type.setValue(2)

      }
      else {
        this.user_type.setValue(3)

      }

      let company_worker = null;
      if (this.shared.role == 'company worker') {
        company_worker = this.shared.customerData.id
      }

      if (this.data != undefined) {


        this.file = filesrc

        var myFormData = new FormData();
        const headers = new HttpHeaders();
        if (this.file != null) {


          if (this.password.value != '') {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', '2');
            myFormData.append('manager_type', this.manager_type.value);
            myFormData.append('description', this.description.value);
            myFormData.append('designation_id', '2');
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);
            // myFormData.append('by_company', null)

            // myFormData.append('first_name', this.firstname.value);
            // myFormData.append('last_name', this.lastname.value);
            // myFormData.append('email', this.email.value);
            // myFormData.append('phone', this.phone.value);
            // myFormData.append('gender', this.gender.value);
            // myFormData.append('user_type', this.user_type.value);
            // myFormData.append('designation_id', this.designation.value);
            // myFormData.append('password', this.password.value);
            // myFormData.append('password_confirmation', this.password_confirmation.value);
            // myFormData.append('by_company', company_worker);


            / Image Post Request /
            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              // "first_name": this.firstname.value,
              // "last_name": this.lastname.value,
              // "email": this.email.value,
              // "phone": this.phone.value,
              // "gender": this.gender.value,
              // "user_type": this.user_type.value,
              // "designation_id": this.designation.value,
              // "password": this.password.value,
              // "password_confirmation": this.password_confirmation.value,
              // "img": this.file,
              // "by_company": company_worker
            'first_name': this.fullName.value.substr(0, this.fullName.value.indexOf(' ')),
            'last_name': this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1),
            'email': this.email.value,
            'phone': this.phone.value,
            'gender': this.gender.value,
            'user_type': '2',
            'manager_type': this.manager_type.value,
            'description': this.description.value,
            'designation_id': '2',
            'password': this.password.value,
            'password_confirmation': this.password_confirmation.value,
            }, { headers: headers }).subscribe(
              (data: any) => {
                this.router.navigate(['admin/managers'])
                this.toast.success('Manager Updated Successfully!', 'Success')

              }, (error: any) => {
                console.log('oops', error)

              });

          }

          else {

            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', '2');
            myFormData.append('manager_type', this.manager_type.value);
            myFormData.append('description', this.description.value);
            myFormData.append('designation_id', '2');
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);



            / Image Post Request /
            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              'first_name': this.fullName.value.substr(0, this.fullName.value.indexOf(' ')),
            'last_name': this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1),
            'email': this.email.value,
            'phone': this.phone.value,
            'gender': this.gender.value,
            'user_type': '2',
            'manager_type': this.manager_type.value,
            'description': this.description.value,
            'designation_id': '2',
            'password': this.password.value,
            'password_confirmation': this.password_confirmation.value,

              "img": this.file,

              "by_company": company_worker
            }, { headers: headers }).subscribe(
              (data: any) => {
                this.router.navigate(['admin/managers'])
                this.toast.success('Manager Updated Successfully!', 'Success')

              }, (error: any) => {
                console.log('oops', error)

              }
            );

          }

        }
        else {


          if (this.password.value != '') {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', '2');
            myFormData.append('manager_type', this.manager_type.value);
            myFormData.append('description', this.description.value);
            myFormData.append('designation_id', '2');
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);

            / Image Post Request /
            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              'first_name': this.fullName.value.substr(0, this.fullName.value.indexOf(' ')),
            'last_name': this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1),
            'email': this.email.value,
            'phone': this.phone.value,
            'gender': this.gender.value,
            'user_type': '2',
            'manager_type': this.manager_type.value,
            'description': this.description.value,
            'designation_id': '2',
            'password': this.password.value,
            'password_confirmation': this.password_confirmation.value,
              "by_company": company_worker
            }).subscribe(
              (data: any) => {
                this.router.navigate(['admin/managers'])
                this.toast.success('Manager Updated Successfully!', 'Success')

              }, (error: any) => {
                console.log('oops', error)
                //  
              });


          }
          else {
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');

            myFormData.append('first_name', this.fullName.value.substr(0, this.fullName.value.indexOf(' ')));
            myFormData.append('last_name', this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1));
            myFormData.append('email', this.email.value);
            myFormData.append('phone', this.phone.value);
            myFormData.append('gender', this.gender.value);
            myFormData.append('user_type', '2');
            myFormData.append('manager_type', this.manager_type.value);
            myFormData.append('description', this.description.value);
            myFormData.append('designation_id', '2');
            myFormData.append('password', this.password.value);
            myFormData.append('password_confirmation', this.password_confirmation.value);


            / Image Post Request /
            this.http.put('https://cloneback.turnkey.no/api/admin/users/' + this.data, {
              'first_name': this.fullName.value.substr(0, this.fullName.value.indexOf(' ')),
            'last_name': this.fullName.value.substr(this.fullName.value.indexOf(' ') + 1),
            'email': this.email.value,
            'phone': this.phone.value,
            'gender': this.gender.value,
            'user_type': '2',
            'manager_type': this.manager_type.value,
            'description': this.description.value,
            'designation_id': '2',
            'password': this.password.value,
            'password_confirmation': this.password_confirmation.value,
              "by_company": company_worker

            }).subscribe((data: any) => {
              this.router.navigate(['admin/managers'])
              this.toast.success('Manager Updated Successfully!', 'Success')

            },
              (error: any) => {
                console.log('oops', error)

              }
            );




          }

        }
      }
      else {
        this.router.navigate(['admin/managers']);
        this.toast.error('Cannot Update Because User ID was not selected', 'Error')
      }
    }

  }

  cancel() {
    this.router.navigate(['admin/managers'])

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


  getEmployeeDetails() {
    this.config.getSecondHttp('admin/users/' + this.data, '').then((data: any) => {
      console.log(data.data);
      this.imageSrc = data.data.img
      this.fullName.setValue((data.data.first_name != null) ? data.data.first_name : '');
      this.fullName.setValue(this.fullName.value + ' ' + data.data.last_name);
      
      this.manager_type.setValue(data.data.manager_type);
      this.description.setValue(data.data.description);
      // this.firstname.setValue(data.data.first_name)
      // this.lastname.setValue(data.data.last_name)
      this.email.setValue(data.data.email)
      this.phone.setValue(data.data.phone)
      this.gender.setValue(data.data.gender)
      this.designation.setValue(data.data.designation_id)
    })
  }

  getDesignations() {

    // this.config.getHttp('admin/designations','').then((data:any)=>{
    //   console.log(data)
    // })

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/admin/designations', {
      headers: headers
    }).subscribe((data: any) => {
      console.log(data);

      for (let a = 0; a < data[0].length; a++) {
        if (data[0][a].designation_name == 'super admin' || data[0][a].designation_name == 'customer') {

        }
        else {

          if (this.userType == 2) {
            if (data[0][a].designation_name == 'project manager') {
              this.Designations.push(data[0][a])
            }

          }
          else {
            if (data[0][a].designation_name != 'project manager') {
              this.Designations.push(data[0][a])
            }
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
  logout() {
    this.shared.logOut();
  }
  changeLang(img: any, lang: any) { }

}
