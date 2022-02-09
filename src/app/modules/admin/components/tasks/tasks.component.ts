import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {



  closeResult: string = '';

  page = 1;
  pageSize = 20
  collectionSize = 0;

  //

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  ID:any;

  taskID: any;
  taskStatus: any;
  tasktitle: any;

  status= new FormControl(0);

  tasks: any[] = []

  key: any
  constructor(public config: ConfigService,
    public shared:SharedDataService, public route: ActivatedRoute, public router: Router, public modalService: NgbModal, public toast: ToasterService) {
    this.ID = this.shared.customerData.id;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.key = this.router.getCurrentNavigation()?.extras.state?.user;

        localStorage.removeItem('keyID');
        localStorage.setItem('keyID', JSON.stringify(this.key));

      }


    });
    this.key = JSON.parse(localStorage.getItem('keyID') || '{}');
    if (this.key == 'total') {
      this.totalTasks()
    }
    if (this.key == 'ongoing') {
      this.ongoingTasks()
    }
    if (this.key == 'completed') {
      this.completeTasks()
    }
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
  totalTasks() {
    this.config.getSecondHttp('employee/total-tasks/' + this.ID, '').then((data: any) => {
      this.tasks = data.data
      
      console.log(data.data)
    })
  }
  ongoingTasks() {
    this.config.getSecondHttp('employee/ongoing-tasks/' + this.ID, '').then((data: any) => {
      this.tasks = data.data
      console.log(data.data)
    })
  }
  completeTasks() {
    this.config.getSecondHttp('employee/completed-tasks/' + this.ID, '').then((data: any) => {
      this.tasks = data.data
      console.log(data.data)
    })
  }
  viewProjectDetails(id: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: id
      }
    };
    this.router.navigate(['admin/project-details'], navigationExtras);
  }

  EditTask(content: any, a: any) {
    this.taskID = a.id;
    this.status.setValue(a.task_status);
    this.tasktitle = a.title;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class1'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  ChangeStatus() {
    this.config.postSecondHttp('update-task-status', {
      "task_id": this.taskID,
      "task_status": this.status.value
    }).then((data: any) => {
      window.location.reload();
   
      this.toast.success('Task Status Changed!', 'Success')
    })

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
}
