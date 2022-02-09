import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
  state
} from "@angular/animations";
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-project-details',
  templateUrl: './customer-project-details.component.html',
  styleUrls: ['./customer-project-details.component.css'],
  animations: [
    trigger("myTrigger", [
      state(
        "fadeInFlash",
        style({
          opacity: "1"
        })
      ),
      transition("void => *", [
        style({ opacity: "0", transform: "translateY(20px)" }),
        animate("500ms")
      ])
    ])
  ]
})
export class CustomerProjectDetailsComponent implements OnInit {

  constructor(public shared: SharedDataService, private http: HttpClient, public modalService: NgbModal) { }
  responsiveOptions: any;
  projectDeatils: any;
  projectTasks: any;
  projectSteps: any;
  projectDrawing: any;
  projectOffer: any;

  ngOnInit(): void {
    this.getProjectDetails();
  }
  getProjectDetails() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/customer/total-projects/' + this.shared.customerData.id, { headers: headers }).subscribe((data: any) => {
    this.projectDeatils = data[0][0];
    this.getSteps();
    this.getProjectDrawing(); 
    this.getProjectOffer();
    })
  }

  getSteps() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/manager/get-steps/' + this.projectDeatils.id, { headers: headers }).subscribe((data: any) => {
      this.projectSteps =  data[0];
  })
  }

  viewProjectOffer(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class1'
    })
  }

  getProjectDrawing() {
    const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.get('https://cloneback.turnkey.no/api/admin/get-project-drawing-client/'+this.shared.customerData.id, { headers: headers }).subscribe((data: any) => {
          console.log(data[0]);
          let b:string = 'src="'+data[0]+'"'
          console.log(b);        
           let a = '<iframe src frameBorder="0" scrolling="auto" height="100%" width="100%" ></iframe>'
         a= a.replace(/(src)/,b)
        //  a = "<iframe src='https://cloneback.turnkey.no/project_files/1641478176.pdf' frameBorder='0' scrolling='auto' height='100%' width='100%' ></iframe>"

          this.projectDrawing =a;
        })
  }

  getProjectOffer(){
    const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.get('https://cloneback.turnkey.no/api/admin/get-project-offer-client/'+ this.shared.customerData.id, { headers: headers }).subscribe((data: any) => {
          console.log(data[0]);
          let b:string = 'src="'+data[0]+'"'
          console.log(b);
        
           let a = '<iframe src frameBorder="0" scrolling="auto" height="100%" width="100%" ></iframe>'
         a= a.replace(/(src)/,b)
         this.projectOffer =a;
        })
  }

}
