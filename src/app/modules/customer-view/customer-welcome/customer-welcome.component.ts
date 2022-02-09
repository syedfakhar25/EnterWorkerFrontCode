import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-customer-welcome',
  templateUrl: './customer-welcome.component.html',
  styleUrls: ['./customer-welcome.component.css']
})
export class CustomerWelcomeComponent implements OnInit {

  constructor(public shared: SharedDataService) { }

  ngOnInit(): void {
  }
  

}
