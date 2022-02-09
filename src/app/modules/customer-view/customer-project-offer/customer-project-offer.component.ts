import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-customer-project-offer',
  templateUrl: './customer-project-offer.component.html',
  styleUrls: ['./customer-project-offer.component.css']
})
export class CustomerProjectOfferComponent implements OnInit {

  constructor(private router: Router, public modalService: NgbModal, private http: HttpClient, private shared: SharedDataService, private toaster: ToasterService) { }

  closeResult: string = '';
  projectOffer = '';
  offerComment: any = '';
  disableNextButton: any = false;

  ngOnInit(): void {
    // this.projectOffer = "<iframe src='https://cloneback.turnkey.no/project_files/1641478176.pdf' frameBorder='0' scrolling='auto' height='100%' width='100%' ></iframe>"
    // this.getProjectOffer();
  }

  viewProjectOffer(content: any) {
    this.getProjectOffer();

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class1'
    })
    // this.modalService.open(content, {
    //   ariaLabelledBy: 'modal-basic-title',
    //   size: 'lg',
    //   windowClass: 'custom-class'
    // }).result.then((result) => {


    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
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

  getProjectOffer() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-project-offer-client/' + this.shared.customerData.id, { headers: headers }).subscribe((data: any) => {
      let b: string = 'src="' + data[0] + '"'
      let a = '<iframe src frameBorder="0" scrolling="auto" height="100%" width="100%" ></iframe>'
      a = a.replace(/(src)/, b)
      this.projectOffer = a;
      this.disableNextButton = true;
    })
  }

  postProjectOfferComment() {
    if (this.offerComment == '') {
      this.router.navigate(['/customer-view/project-drawing']);
    } else {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/admin/offer-comment/' + this.shared.customerData.id, {
        timeline_comment: this.offerComment
      }, { headers: headers }).subscribe((data: any) => {
        this.toaster.success('Your comment has been posted Successfully!', 'Success');
        this.router.navigate(['/customer-view/project-drawing']);
      })
    }
  }

}
