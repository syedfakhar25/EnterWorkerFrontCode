import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-customer-project-drawing',
  templateUrl: './customer-project-drawing.component.html',
  styleUrls: ['./customer-project-drawing.component.css']
})
export class CustomerProjectDrawingComponent implements OnInit {

  constructor(private router: Router, public modalService: NgbModal, private http: HttpClient, private shared: SharedDataService, private toaster: ToasterService) { }

  ngOnInit(): void {
    // this.getProjectDrawing();
  }

  projectDrawing: any
  drawingComment: any = '';
  disableNextButton: any = false;

  viewProjectOffer(content: any) {
    this.getProjectDrawing();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class1'
    })
  }

  postProjectDrawingComment() {
    if (this.drawingComment == '') {
      this.router.navigate(['/customer-view/project-timeline']);
    } else {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/admin/drawing-comment/' + this.shared.customerData.id, {
        timeline_comment: this.drawingComment
      }, { headers: headers }).subscribe((data: any) => {
        this.toaster.success('Your comment has been posted Successfully!', 'Success');
        this.router.navigate(['/customer-view/project-timeline']);
      })
    }
  }

  getProjectDrawing() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-project-drawing-client/' + this.shared.customerData.id, { headers: headers }).subscribe((data: any) => {
      console.log(data[0]);
      let b: string = 'src="' + data[0] + '"'
      console.log(b);
      let a = '<iframe src frameBorder="0" scrolling="auto" height="100%" width="100%" ></iframe>'
      a = a.replace(/(src)/, b)
      //  a = "<iframe src='https://cloneback.turnkey.no/project_files/1641478176.pdf' frameBorder='0' scrolling='auto' height='100%' width='100%' ></iframe>"

      this.projectDrawing = a;
      this.disableNextButton = true;
    })
  }
}
