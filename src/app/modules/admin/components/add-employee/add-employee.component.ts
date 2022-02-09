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
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit, OnDestroy {


  imageSrc: string = '';
  formData = new FormGroup({
    fullName: new FormControl(''),
    // lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    // gender: new FormControl(''),
    manager_type: new FormControl(1),
    // designation: new FormControl(''),
    password: new FormControl(''),
    description: new FormControl(''),
    password_confirmation: new FormControl(''),
  });


  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  file: any;
  fileSource: any;
  manager_types = [
    { id: 1, value: 'Economy' },
    { id: 2, value: 'Architecture' },
    { id: 3, value: 'Builder' },
    { id: 4, value: 'Appraiser' },
  ]

  Designations: any[] = []

  data: any;
  constructor(public router: Router, public shared: SharedDataService,
    public route: ActivatedRoute, public toast: ToasterService, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras.state?.user;
        localStorage.removeItem('UserType');
        localStorage.setItem('UserType', JSON.stringify(this.data));



      }

    });
    this.data = JSON.parse(localStorage.getItem('UserType') || '{}');

    console.log(this.data)
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

  submit() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.formData.value.fullName == '' || this.formData.value.fullName == undefined || this.formData.value.fullName == null) {
      this.toast.error('Manager name field is required!');
      return;
    }
    if (this.formData.value.email == '' || this.formData.value.email == undefined || this.formData.value.email == null) {
      this.toast.error('Email field is required!');
      return;
    }
    if (this.formData.value.phone == '' || this.formData.value.phone == undefined || this.formData.value.phone == null) {
      this.toast.error('Phone Number field is required!');
      return;
    }
    if (this.formData.value.manager_type == '' || this.formData.value.manager_type == undefined || this.formData.value.manager_type == null) {
      this.toast.error('Manage Type is required');
      return;
    }

    if (this.formData.value.password == '' || this.formData.value.password == undefined || this.formData.value.password == null) {
      this.toast.error('password field is required!');
      return;
    }
    if (this.formData.value.password_confirmation == '' || this.formData.value.password_confirmation == undefined || this.formData.value.password_confirmation == null) {
      this.toast.error('Password confirmation field is required!');
      return;
    }
    if (!re.test(this.formData.value.email)) {
      this.toast.error('Wrong Email Format', 'Error')
      return;
    }
    if (this.formData.value.password.length < 8) {
      this.toast.error('Password Length Too Short', 'Error')
      return;
    }
    if (this.formData.value.password != this.formData.value.password_confirmation) {
      this.toast.error('Password doesnot match', 'Error')
      return;
    }
    else {
      if (this.data == 2) {
        this.formData.value.manager_type = 2

      }
      else {
        this.formData.value.manager_type = 3

      }

      let company_worker = null;
      if (this.shared.role == 'company worker') {
        company_worker = this.shared.customerData.id
      }

      if (this.file == undefined || this.file == null) {
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('first_name', this.formData.value.fullName.substr(0, this.formData.value.fullName.indexOf(' ')));
        myFormData.append('last_name', this.formData.value.fullName.substr(this.formData.value.fullName.indexOf(' ') + 1));
        myFormData.append('email', this.formData.value.email);
        myFormData.append('phone', this.formData.value.phone);
        myFormData.append('gender', this.formData.value.gender);
        myFormData.append('user_type', '3');
        myFormData.append('designation_id', '24');
        myFormData.append('description', this.formData.value.description);
        myFormData.append('password', this.formData.value.password);
        myFormData.append('password_confirmation', this.formData.value.password_confirmation);
        myFormData.append('by_company', '1')

        // / Image Post Request /
        this.http.post('https://cloneback.turnkey.no/api/admin/users', myFormData, {
          headers: headers
        }).subscribe(data => {
          this.router.navigate(['admin/employees'])
          this.toast.success('Employee Added Successfully!', 'Success')
        },
          (error: any) => {
            console.log('oops', error)
            //   
          }
        );
      }




      else {

        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('img', this.file);
        myFormData.append('first_name', this.formData.value.fullName.substr(0, this.formData.value.fullName.indexOf(' ')));
        myFormData.append('last_name', this.formData.value.fullName.substr(this.formData.value.fullName.indexOf(' ') + 1));
        myFormData.append('email', this.formData.value.email);
        myFormData.append('phone', this.formData.value.phone);
        myFormData.append('gender', this.formData.value.gender);
        myFormData.append('description', this.formData.value.description);
        myFormData.append('user_type', '3');
        myFormData.append('designation_id', '24');
        myFormData.append('password', this.formData.value.password);
        myFormData.append('password_confirmation', this.formData.value.password_confirmation);
        myFormData.append('by_company', '1')

        // / Image Post Request /
        this.http.post('https://cloneback.turnkey.no/api/admin/users', myFormData, {
          headers: headers
        }).subscribe(data => {
          this.router.navigate(['admin/employees'])
          this.toast.success('Employee Added Successfully!', 'Success')
        },
          (error: any) => {
            console.log('oops', error)
            //  
          }
        );
      }




    }
  }
  cancel() {
    this.router.navigate(['admin/employees'])

  }




  onFileChange(event: any) {
    const reader = new FileReader();

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
      console.log(data)

      for (let a = 0; a < data[0].length; a++) {
        if (data[0][a].designation_name == 'super admin' || data[0][a].designation_name == 'customer' || data[0][a].designation_name == 'company worker') {

        }
        else {

          if (this.data == 2) {
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
