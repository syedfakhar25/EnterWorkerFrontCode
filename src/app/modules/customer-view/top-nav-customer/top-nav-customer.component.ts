import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-top-nav-customer',
  templateUrl: './top-nav-customer.component.html',
  styleUrls: ['./top-nav-customer.component.css']
})
export class TopNavCustomerComponent implements OnInit {

  constructor(public shared: SharedDataService, private router: Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem('Tks')
    if(token ==null) {
      this.router.navigate(['admin']);
    }
    
  }
  logout() {
    localStorage.removeItem('Users');  
   localStorage.removeItem('Tks');
   this.router.navigate(['admin']);
   window.location.reload()
  }
  changeLang(img: any, lang: any) { }

}
