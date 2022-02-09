import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


role:any;
  constructor(public shared: SharedDataService, public router: Router) {
    this.role = this.shared.role;
    console.log(this.role)
   }

  ngOnInit(): void {
  }

  admintotalProjects() {
    let a = 'total'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/projects'], navigationExtras);
  }
 
}
