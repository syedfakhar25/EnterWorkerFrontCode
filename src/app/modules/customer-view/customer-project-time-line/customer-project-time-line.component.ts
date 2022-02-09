import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-customer-project-time-line',
  templateUrl: './customer-project-time-line.component.html',
  styleUrls: ['./customer-project-time-line.component.css']
})
export class CustomerProjectTimeLineComponent implements OnInit {

  constructor(private router: Router, public modalService: NgbModal, private http: HttpClient, private shared: SharedDataService, private toaster: ToasterService) { }

  ngOnInit(): void {
  }

  closeResult: string = '';
  projectTimeLine: any;
  timeLineComment: any = '';
  disableNextButton: any = false;
  workingDays: any;

  viewTimeLine(content: any) {
    this.getTimeLineData()
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getTimeLineData() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/project_timeline/' + this.shared.customerData.id,
      { headers: headers }).subscribe((data: any) => {
        this.projectTimeLine = data[0];
        this.getBusinessDays();
      },
        (error: any) => {
          console.log('oops', error)
        })
  }

  postProjecTimeLineComment() {
    if (this.timeLineComment == '') {
      this.router.navigate(['/customer-view/customer-project-details']);
    } else {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/admin/timeline-comment/' + this.shared.customerData.id, {
        timelinecomment: this.timeLineComment
      }, { headers: headers }).subscribe((data: any) => {
        this.toaster.success('Your comment has been posted Successfully!', 'Success');
        this.router.navigate(['/customer-view/customer-project-details']);
      })
    }
  }
  acceptOffer() {
    this.disableNextButton = true;
  }

  getBusinessDays() {
    // var lastDay = moment('2021-01-31');
    // var firstDay = moment('2021-01-01');
    var lastDay = moment(this.projectTimeLine?.end_date);
    var firstDay = moment(this.projectTimeLine?.start_date);
    let calcBusinessDays = 1 + (lastDay.diff(firstDay, 'days') * 5 -
      (firstDay.day() - lastDay.day()) * 2) / 7;

    if (lastDay.day() == 6) calcBusinessDays--;//SAT
    if (firstDay.day() == 0) calcBusinessDays--;//SUN
    this.workingDays = calcBusinessDays;
  }

}
