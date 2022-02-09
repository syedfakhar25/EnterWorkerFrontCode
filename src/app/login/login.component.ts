import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.login();
    }
  }

  email = new FormControl('');
  password = new FormControl('')
  remember_me = new FormControl(0)
  constructor(public config: ConfigService, public shared: SharedDataService,
    private http: HttpClient,
    public toast: ToasterService, public router: Router) {
    if (this.shared.token == null || undefined) {
      this.router.navigate(['/login']);
    }
    else if (this.shared.token != null || undefined) {
      if (this.shared.customerData.user_type == 4) {
        this.router.navigate(['customer-view'])
      } else {
        this.router.navigate(['admin/home'])
      }
    }
  }

  ngOnInit(): void {
  }

  login() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://https://cloneback.turnkey.no/api/auth/login', {
      'email': this.email.value,
      'password': this.password.value,
      'remember_me': this.remember_me.value
    }, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      if (data.status != 200) {
        this.toast.error(data.message, 'Error')
      }
      else if (data.status == 200) {
        console.log(data)
        this.shared.login(data);
        window.location.reload()

        this.toast.success(data.message, 'Success')

      }


    }, (error) => {                              //Error callback
      this.toast.error('User Name or Password is incorrect!', 'Error');
      console.error('Error')
    })
  }

  RememberMe(event: any) {
    console.log(event.target.checked);
    if (event.target.checked == true) {
      this.remember_me.setValue(1)
      return;
    }
    else if (event.target.checked == false) {
      this.remember_me.setValue(0)
      return;
    }
  }
}
