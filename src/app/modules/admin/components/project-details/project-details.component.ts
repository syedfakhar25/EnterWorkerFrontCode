import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';


import {
  AfterViewInit,
  ChangeDetectorRef,
  AfterContentChecked,
  AfterContentInit
} from "@angular/core";
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


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
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
export class ProjectDetailsComponent implements OnInit {


  longText = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose(injected humour and the like). packages and web page editors now use Lorem Ipsum as their default model text, and a"
  //Fade Animation//

  flag: boolean = true;

  state: string = "fadeInFlash";
  //
  employee_name: any;

  role: any;
  progress = 10;
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  //Modal Service//
  closeResult: string = '';

  //
  //pagination//

  page = 1;
  pageSize = 5
  collectionSize = 0;


  page1 = 1;
  pageSize1 = 5
  collectionSize1 = 0;


  page2 = 1;
  pageSize2 = 5
  collectionSize2 = 0;
  //

  //Client v0.2 variables//
  file: any;

  file2: any;

  //



  projectDetails: any;
  AllEmployees: any[] = []
  AllEmp: any[] = []
  Employees: any[] = []
  EmpTasks: any[] = []
  employeeId = '';
  taskId = '';
  status = new FormControl(0)
  selectedEmployee: any;
  formData = {
    employee: '',
    title: '',
    deadline: '',
    percentage: 0,

  }

  deadline: any;
  startingline: any
  start: any;
  end: any;
  remaining = 0;
  Tasks: any[] = []
  data: any;


  NewStepData = {
    taskdetail: '',
    name: '',
    deadline: Date
  }
  //New Carousal//
  responsiveOptions: any;
  //New Carousal//


  projectManagers: any[] = []

  slctMangerID: any;
  slctTeamID: any;


  taskData = {
    important: false,
    title: '',
    employee_id: 0,
    status: '',
    active: 0,
    deadline: '',
  }


  Important = new FormControl(false);
  title = new FormControl('');
  employee = new FormControl(0);
  status1 = new FormControl('');
  active = new FormControl(0);
  deadline1 = new FormControl('');
  constructor(public router: Router, public toast: ToasterService, private http: HttpClient,
    public shared: SharedDataService,

    public route: ActivatedRoute, public modalService: NgbModal, public config: ConfigService) {
    this.role = this.shared.role;
    console.log(this.shared.customerData.id)
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras.state?.user;

        localStorage.removeItem('ProjectID');
        localStorage.setItem('ProjectID', JSON.stringify(this.data));

      }


    });
    this.data = JSON.parse(localStorage.getItem('ProjectID') || '{}');
    // console.log(this.data)
    if (this.role == 'admin' || this.role == 'project manager') {
      this.getProjectdetatails();
      //  this.getAllEmployees();
      this.getAllManagers()

      //Company Worker methods
      this.getAllWorkers()


      //


      // this.getEmployeeTasks();
      this.getTeamMembers()
      this.getSteps()

      this.getProjectDrawing()

    }
    if (this.role == 'employee') {
      this.getProjectdetatails();
      this.getSteps()
      this.getAllManagers()
      this.getTeamMembers()

      this.getProjectDrawing()
      this.getProjectOffer()
      this.getPP()

      this.getExtraWork()
      this.getOrders()
    }

    if (this.role == 'company worker') {
      this.getProjectdetatails();
      this.getSteps()
      this.getAllManagers()
      this.getTeamMembers()

      this.getProjectDrawing()
      this.getProjectOffer()
      this.getPP()

      this.getExtraWork()
      this.getOrders()

      //Company Worker methods
      this.getAllWorkers()


      //
    }

    //New Carousal//

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5,
        numScroll: 5
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    //New Carousal//

  }

  ngOnInit() {

    this.getProjectManagers();
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

  checkImg(b: any) {
    console.log(b);
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


  workingdays: any;

  company_worker_id: any;
  getProjectdetatails() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/projects/' + this.data,
      { headers: headers }).subscribe((data: any) => {

        this.projectDetails = data.data;
        console.log(data.data)
        this.company_worker_id = this.projectDetails.company_worker_id
        console.log(this.company_worker_id)
        if (this.company_worker_id != null) {
          this.getEmployeeForCT(this.company_worker_id)
          this.getCTeam()
        }

        this.deadline = this.projectDetails.end_date;
        this.startingline = this.projectDetails.start_date;



        var date1 = new Date(this.startingline);
        var date2 = new Date(this.deadline);

        var Difference_In_Time = date2.getTime() - date1.getTime();
        this.workingdays = Difference_In_Time / (1000 * 3600 * 24);






        let L = Object.keys(this.projectDetails.employee).length;
        // for (let i = 0; i < L; i++) {
        //   this.Employees.push(this.projectDetails.employee[i]);
        // }

        // console.log(this.Employees)

        for (let j = 0; j < Object.keys(this.projectDetails.tasks).length; j++) {
          this.Tasks.push(this.projectDetails.tasks[j]);
        }

        let sum = 0;
        let s = 0
        for (let i = 0; i < this.Tasks.length; i++) {
          s = parseInt(this.Tasks[i].percentage);
          sum = sum + s
        }
        let total = 100;
        let remain = total - sum;

        this.remaining = remain
      })
  }


  getAllEmployees() {
    this.config.getSecondHttp('all-employee', '').then((data: any) => {

      // this.AllEmployees = data.data
      //      console.log(data.data);

    })
  }

  getAllManagers() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/employees', { headers: headers }).subscribe((data: any) => {

      //  console.log(data)
      for (let a = 0; a < data[0].length; a++) {
        if (data[0][a].designation_name == 'project manager') {
          //   console.log(data[0][a])
          this.projectManagers.push(data[0][a])
        }
        else {

        }

      }



      //    console.log(this.projectManagers.length)
      this.collectionSize1 = this.projectManagers.length
    })

  }


  getRemainingEmployees() {
    this.config.getSecondHttp('employee-for-project/' + this.data, '').then((data: any) => {
      console.log(data.data)
      let a: any[] = []
      a = data.data;
      //     console.log(this.Employees[0].id)
      this.AllEmp = [];
      for (let b = 0; b < a.length; b++) {


        //    console.log(this.Employees[b]?.id)
        if (this.Employees[0]?.id != a[b].id && a[b].designation != 'project manager' && a[b].designation != null) {
          this.AllEmp.push(a[b]);
        }
        else {

        }
      }

      //   console.log(this.AllEmp)


    })
  }


  //Get All Company Workers
  companyWorkers: any[] = []
  getAllWorkers() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/all-company-workers', { headers: headers }).subscribe((data: any) => {

      //  console.log(data)
      this.companyWorkers = data.data



      //    console.log(this.projectManagers.length)
      this.collectionSize1 = this.projectManagers.length
    })
  }

  //

  addMember(content: any) {
    this.getRemainingEmployees()
    this.employeeId = '';
    this.formData.title = '';
    this.formData.percentage = 0;
    this.formData.deadline = ''
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  selectTeam(id: any) {
    this.slctTeamID = id
  }
  AddTeam() {

    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    if (this.projectDetails.id == '' || this.projectDetails.id == undefined || this.projectDetails.id == null) {
      this.toast.warning('Project Id is undefined', 'Warning')
      return;
    }
    else {



      //     console.log(this.slctTeamID);

      this.http.post('https://cloneback.turnkey.no/api/admin/project-team', {
        "project_id": this.data,
        "employee_id": this.slctTeamID,
      }, { headers: headers }).subscribe((data: any) => {
        this.modalService.dismissAll();

        //      console.log(data);
        // window.location.reload()
        this.getTeamMembers();

      },
        (error: any) => {
          console.log('oops', error)

        })
    }
    this.toast.success('Team Member Added Successfully!', 'Success');
  }



  AddPM() {

    console.log(this.data)
    console.log(this.slctMangerID)
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/admin/add-manager/' + this.data, {

      "manager_id": this.slctMangerID,
    }, { headers: headers }).subscribe((data: any) => {
      this.modalService.dismissAll();

      // window.location.reload()
      this.getProjectManagers();
      console.log(data)

    },
      (error: any) => {
        console.log('oops', error)
        //  
      })

    this.toast.success('Project Manager Added Successfully!', 'Success');


  }


  allProjectManagers: any;

  getProjectManagers() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/admin/get-managers/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      this.allProjectManagers = data[0];
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }



  addTaskfromTM(content: any, id: any) {
    this.formData.title = '';
    this.formData.deadline = '';
    this.formData.percentage = 0;
    this.employeeId = id;


    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  getTeamMembers() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/manager/get-team/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      let a: any[] = [];
      for (let b = 0; b < data[0].team.length; b++) {
        if (data[0].team[b].designation_name != 'project manager') {
          a.push(data[0].team[b])
        }

      }
      this.Employees = a

      //   console.log(this.Employees)
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }

  addTask(content: any) {
    this.formData.title = '';
    this.formData.deadline = '';
    this.formData.percentage = 0;
    this.employeeId = '';


    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  addNewTask() {



    if (this.formData.title == '' || this.formData.title == undefined || this.formData.title == null) {
      this.toast.warning('Task Title is required!', 'Required')
      return;
    }
    if (this.employeeId == '') {
      if (this.formData.employee == '' || this.formData.employee == undefined || this.formData.employee == null) {
        this.toast.warning('Employee name is required!', 'Required')
        return;
      }
    }

    if (this.formData.deadline == '' || this.formData.deadline == undefined || this.formData.deadline == null) {
      this.toast.warning('Task Deadline is required!', 'Required')
      return;
    }
    if (this.formData.percentage == undefined || this.formData.percentage == null || this.formData.percentage == 0) {
      this.toast.warning('Task Percentage is required!', 'Required')
      return;
    }
    if (this.formData.percentage > this.remaining) {
      this.toast.warning('Task Percentage should be less than total tasks percentage', 'Warning')
      return;
    }
    if (this.formData.deadline > this.deadline) {
      this.toast.warning('Task Deadline should be less than Project Deadline', 'Warning')
      return;
    }
    if (this.formData.deadline < this.startingline) {
      this.toast.warning('Task Deadline should be greater than Project Starting Date', 'Warning')
      return;
    }
    if (this.projectDetails.id == '' || this.projectDetails.id == undefined || this.projectDetails.id == null) {
      this.toast.warning('Project Id is undefined', 'Warning')
      return;
    }
    else {



      //Get StartDateTime
      let date = new Date().toISOString().slice(0, 10)

      let hour = new Date().getUTCHours();
      let seconds = new Date().getSeconds();
      let minutes = new Date().getMinutes();




      let h;
      let s;
      let m;
      if (hour < 10) {
        h = '0' + hour;
        if (minutes < 10) {
          m = '0' + minutes
          if (seconds < 10) {
            s = '0' + seconds;

          }
          else if (seconds >= 10) {
            s = seconds;

          }
        }
        else {
          m = minutes
          if (seconds < 10) {
            s = '0' + seconds;

          }
          else if (seconds >= 10) {
            s = seconds;

          }
        }

      }
      else {
        h = hour;
        if (minutes < 10) {
          m = '0' + minutes
          if (seconds < 10) {
            s = '0' + seconds;

          }
          else if (seconds >= 10) {
            s = seconds;

          }
        }
        else {
          m = minutes
          if (seconds < 10) {
            s = '0' + seconds;

          }
          else if (seconds >= 10) {
            s = seconds;

          }
        }
      }

      let startTime = h + ':' + m + ':' + s;

      let startdatetime = date + ' ' + startTime;
      this.start = startdatetime;


      //Get EndDateTime
      let date1 = new Date(this.formData.deadline).toISOString().slice(0, 10)

      let hour1 = new Date(this.formData.deadline).getUTCHours();
      let seconds1 = new Date(this.formData.deadline).getSeconds();
      let minutes1 = new Date(this.formData.deadline).getMinutes();




      let h1;
      let s1;
      let m1;
      if (hour1 < 10) {
        h1 = '0' + hour1;
        if (minutes1 < 10) {
          m1 = '0' + minutes1
          if (seconds1 < 10) {
            s = '0' + seconds1;

          }
          else if (seconds1 >= 10) {
            s1 = seconds1;

          }
        }
        else {
          m1 = minutes1
          if (seconds1 < 10) {
            s1 = '0' + seconds1;

          }
          else if (seconds1 >= 10) {
            s1 = seconds1;

          }
        }

      }
      else {
        h1 = hour1;
        if (minutes1 < 10) {
          m1 = '0' + minutes1
          if (seconds1 < 10) {
            s = '0' + seconds1;

          }
          else if (seconds1 >= 10) {
            s1 = seconds1;

          }
        }
        else {
          m1 = minutes1
          if (seconds1 < 10) {
            s = '0' + seconds1;

          }
          else if (seconds1 >= 10) {
            s1 = seconds1;

          }
        }
      }

      let startTime1 = h + ':' + m + ':' + s;

      let startdatetime1 = date1 + ' ' + startTime1;
      this.end = startdatetime1;


      this.config.postSecondHttp('manager/tasks', {
        "project_id": this.projectDetails.id,
        "employee_id": this.employeeId,
        "title": this.formData.title,
        "percentage": this.formData.percentage,
        "deadline": this.formData.deadline,
        "task_status": 0,
        "color": { primary: '#ff0000', secondary: '#f79588' },
        "allDay": "true",
        "start": this.start,
        "end": this.end,
        "draggable": null,
        "resizable": null

      }).then((data: any) => {
        this.modalService.dismissAll();
        window.location.reload()

        this.toast.success('Task Added Successfully!', 'Success');
      })
    }

  }

  SelectEmployee(a: any) {
    var i = 0
    for (i; i < this.AllEmployees.length; i++) {
      if (this.AllEmployees[i].first_name == a) {

        this.employeeId = this.AllEmployees[i].id;
        return;
      }
    }
  }

  SelectManager(id: any) {
    this.slctMangerID = id;
  }

  slctWorkerID: any;

  SelectWorker(id: any) {
    this.slctWorkerID = id;
  }

  deleteTask(id: any) {
    let i = this.data;
    this.config.deleteSecondHttp('manager/tasks/' + id, '').then((data: any) => {


      window.location.reload()
      this.toast.success('Task Deleted Successfully', 'Succces')

    })

  }
  editTask(content: any, a: any) {

    this.formData.title = a.title;
    this.formData.deadline = a.deadline;

    this.formData.percentage = a.percentage;
    this.employeeId = a.employee.id;
    this.taskId = a.id;

    //Get StartDateTime
    let date = new Date(a.created_at).toISOString().slice(0, 10)

    let hour = new Date(a.created_at).getUTCHours();
    let seconds = new Date(a.created_at).getSeconds();
    let minutes = new Date(a.created_at).getMinutes();




    let h;
    let s;
    let m;
    if (hour < 10) {
      h = '0' + hour;
      if (minutes < 10) {
        m = '0' + minutes
        if (seconds < 10) {
          s = '0' + seconds;

        }
        else if (seconds >= 10) {
          s = seconds;

        }
      }
      else {
        m = minutes
        if (seconds < 10) {
          s = '0' + seconds;

        }
        else if (seconds >= 10) {
          s = seconds;

        }
      }

    }
    else {
      h = hour;
      if (minutes < 10) {
        m = '0' + minutes
        if (seconds < 10) {
          s = '0' + seconds;

        }
        else if (seconds >= 10) {
          s = seconds;

        }
      }
      else {
        m = minutes
        if (seconds < 10) {
          s = '0' + seconds;

        }
        else if (seconds >= 10) {
          s = seconds;

        }
      }
    }

    let startTime = h + ':' + m + ':' + s;

    let startdatetime = date + ' ' + startTime;
    this.start = startdatetime;


    //Get EndDateTime
    let date1 = new Date(this.formData.deadline).toISOString().slice(0, 10)

    let hour1 = new Date(this.formData.deadline).getUTCHours();
    let seconds1 = new Date(this.formData.deadline).getSeconds();
    let minutes1 = new Date(this.formData.deadline).getMinutes();




    let h1;
    let s1;
    let m1;
    if (hour1 < 10) {
      h1 = '0' + hour1;
      if (minutes1 < 10) {
        m1 = '0' + minutes1
        if (seconds1 < 10) {
          s = '0' + seconds1;

        }
        else if (seconds1 >= 10) {
          s1 = seconds1;

        }
      }
      else {
        m1 = minutes1
        if (seconds1 < 10) {
          s1 = '0' + seconds1;

        }
        else if (seconds1 >= 10) {
          s1 = seconds1;

        }
      }

    }
    else {
      h1 = hour1;
      if (minutes1 < 10) {
        m1 = '0' + minutes1
        if (seconds1 < 10) {
          s = '0' + seconds1;

        }
        else if (seconds1 >= 10) {
          s1 = seconds1;

        }
      }
      else {
        m1 = minutes1
        if (seconds1 < 10) {
          s = '0' + seconds1;

        }
        else if (seconds1 >= 10) {
          s1 = seconds1;

        }
      }
    }

    let startTime1 = h + ':' + m + ':' + s;

    let startdatetime1 = date1 + ' ' + startTime1;
    this.end = startdatetime1;

    if (a.task_status == '0') {
      this.status.setValue('0')
    }
    else if (a.task_status == '1') {
      this.status.setValue('1')
    }

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  updateTask() {
    if (this.formData.title == '' || this.formData.title == undefined || this.formData.title == null) {
      this.toast.warning('Task Title is required!', 'Required')
      return;
    }

    if (this.formData.deadline == '' || this.formData.deadline == undefined || this.formData.deadline == null) {
      this.toast.warning('Task Deadline is required!', 'Required')
      return;
    }
    if (this.formData.percentage == undefined || this.formData.percentage == null || this.formData.percentage == 0) {
      this.toast.warning('Task Percentage is required!', 'Required')
      return;
    }
    if (this.formData.deadline > this.deadline) {
      this.toast.warning('Task Deadline should be less than Project Deadline', 'Warning')
      return;
    }
    if (this.formData.deadline < this.startingline) {
      this.toast.warning('Task Deadline should be greater than Project Starting Date', 'Warning')
      return;
    }

    if (this.projectDetails.id == '' || this.projectDetails.id == undefined || this.projectDetails.id == null) {
      this.toast.warning('Project Id is undefined', 'Warning')
      return;
    }
    else {

      console.log(this.taskId)
      console.log(this.start);
      this.config.putSecondHttp('manager/tasks/' + this.taskId, {
        "project_id": this.projectDetails.id,
        "employee_id": this.employeeId,
        "title": this.formData.title,
        "percentage": this.formData.percentage,
        "deadline": this.formData.deadline,
        "task_status": this.status.value,
        "color": { primary: '#ff0000', secondary: '#f79588' },
        "allDay": "true",
        "start": this.start,
        "end": this.end,
        "draggable": null,
        "resizable": null
      }).then((data: any) => {
        this.modalService.dismissAll();

        window.location.reload()

        this.toast.success('Task Updated Successfully!', 'Success')
      })
    }
  }


  getEmployeeTasks() {

  }

  viewTasks(content: any, id: any) {

    this.config.postSecondHttp('employee-tasks', {
      "employee_id": id,
      "project_id": this.data
    }).then((data: any) => {
      this.EmpTasks = data.data;

    })
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getProjectDetails() {

    // this.projectDetails = this.dummyProjectDetails;
    // console.log(this.projectDetails)
  }

  openChat(a: any) {

    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/chat'], navigationExtras);
    // this.router.navigate(['admin/chat'])
  }


  submit() {

  }







  //Carousel NEw



  //Create Steps
  createStep(order: any) {
    // console.log(this.data);
    // this.config.postHttp('admin/steps',{
    //   'project_id':this.data,
    //   'task_status':1,
    //   'step_order':1
    // }).then((data:any)=>{
    //   console.log(data);

    // })

    let company_worker: any = null;

    if (this.role == 'company worker') {
      company_worker = 1;
    }

    console.log(company_worker);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/admin/step-in', {
      'project_id': this.data,
      'active': 0,
      'step_order': order,
      'task_status': 1,
      'company_worker': company_worker
    }, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      window.location.reload()
    })
    this.toast.success('Step Added Successfully!', 'success')
  }

  deleteStep(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.delete('https://cloneback.turnkey.no/api/admin/steps/' + id, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      // window.location.reload()
      this.getSteps();
    })

    this.toast.success('Step Deleted Successfully!', 'success')
  }



  steps: any;

  getSteps() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-steps/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data[0]);
      this.steps = data[0]
      //   console.log(this.steps[0].tasks)
    })
  }

  empSelect(id: any) {
    console.log(id)
    this.taskData.employee_id = id;
  }


  important: any;

  addItem(id: any) {
    // if (this.flag) {

    //   this.flag = !this.flag;
    // }
    // this.Tsks.push(this.NewStepData);







    if (this.Important.value == true) {

      this.important = 1;
    }
    else if (this.Important.value == false) {
      this.important = 0;

    }

    var d1 = new Date(this.deadline1.value);
    var d2 = new Date(this.projectDetails.end_date);
    var d3 = new Date(this.projectDetails.start_date);

    if (this.employee.value == null || this.employee.value == undefined) {
      this.toast.error('Please Select Employee to assign task to!')
      return;
    }
    if (this.title.value == null || this.title.value == undefined || this.title.value == '') {
      this.toast.error('Please write down the task ')
      return;
    }

    if (this.status1.value == null || this.status1.value == undefined || this.status1.value == '') {
      this.toast.error('Please select Task Status')
      return;
    }

    if (this.deadline1.value == null || this.deadline1.value == undefined || this.deadline1.value == '') {
      this.toast.error('Please select Task Deadline')
      return;
    }

    if (d1.getTime() > d2.getTime()) {
      this.toast.warning('Task Deadline Cannot Be Greater Than Project End Date!', 'Error')
      return;
    }

    if (d1.getTime() < d3.getTime()) {
      this.toast.warning('Task Deadline Cannot Be Less Than Project Start Date!', 'Error')
      return;
    }

    else {
      console.log('Step ID', id);
      console.log('Employee ID', this.employee.value),
        console.log('Task Title', this.title.value),
        console.log('Task Status', this.status1.value),
        console.log('Is Important', this.important),
        console.log('Task Deadline', this.deadline1.value),
        console.log('Project ID', this.data);

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/admin/tasks',
        {
          employee_id: this.employee.value,
          title: this.title.value,
          task_status: this.status1.value,
          step_id: id,
          is_important: this.important,
          deadline: this.deadline1.value,
          project_id: this.data,



        }, { headers: headers }).subscribe((data: any) => {
          console.log(data);

          // window.location.reload()
          this.getSteps();
          this.toast.success('Task Added Successfully!')
        })



    }



  }


  updateTsk(event: any, step: any) {
    // debugger
    console.log(event)
    console.log(step)

    let countImportant = 0;
    let countImportantDone = 0;
    let tasks: any;


    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
      {
        step_id: event.step_id,
        project_id: event.project_id,
        employee_id: event.employee_id,
        title: event.title,
        task_status: event.task_status,
        is_important: event.is_important,
        deadline: event.deadline
      }, { headers: headers }).subscribe((data: any) => {
        console.log(data);






        this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
          { headers: headers }).subscribe((data: any) => {
            console.log(data[0]);
            let a = 0
            tasks = data[0]
            for (a; a < tasks.length; a++) {
              if (tasks[a].is_important == 1) {
                countImportant = countImportant + 1;
                if (tasks[a].task_status == 2) {
                  countImportantDone++;
                }

              }
            }
            console.log(countImportant)
            console.log(countImportantDone);
            if (countImportant == countImportantDone) {
              console.log('All important done')
              this.ActivateStep(step.id, event.project_id)
            }

            else {
              console.log('Not all important done')
              this.ActivateStep(step.id, event.project_id)
            }



          })


      })


  }


  ActivateStep(step_id: any, project_id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/step-automation/' + project_id,
      {
        step_id: step_id,

      }, { headers: headers }).subscribe((data: any) => {
        console.log(data);

        // window.location.reload()
        this.getSteps();

      })

    this.toast.success('Task Updated Successfully!')
  }



  deleteTsk(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.delete('https://cloneback.turnkey.no/api/admin/tasks/' + id, { headers: headers }).subscribe((data: any) => {
      console.log(data);

      // window.location.reload()
      this.getSteps();

    })

    this.toast.success('Task Deleted Successfully!')
  }

  navToProjects() {
    this.router.navigate(['admin/projects']);
  }

  /*Client v0.2 Methods */


  download() {
  }

  uploadProjectOffer() {
    console.log('yes')
  }

  openFileUploader(content: any, id: any) {
    console.log(id);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    })
  }

  fileUpload(event: any) {
    this.file = null;
    if (event.target.files[0].type == 'application/pdf') {
      this.file = event.target.files[0]
    }


  }
  reset(element: any) {
    element.value = "";
    this.file = null;
  }

  uploadFile() {
    console.log(this.file);

    var formdata = new FormData();


    formdata.append("project_offer", this.file);

    let requestOptions: RequestInit = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://cloneback.turnkey.no/api/admin/upload-project-offer/" + this.data, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));


    this.modalService.dismissAll();

    this.toast.success('File Uploaded Successfully!', 'Success')

    setInterval(() => {
      window.location.reload();
    }, 5000);

  }

  cancel() {
    this.file = null;
    this.modalService.dismissAll();
  }


  download2() { }

  uploadProjectDrawing() {
    console.log('yes')
  }

  openFileUploader2(content: any, id: any) {
    console.log(id);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    })
  }

  fileUpload2(event: any) {
    this.file2 = null;

    this.file2 = event.target.files[0]



  }
  reset2(element: any) {
    element.value = "";
    this.file2 = null;
  }

  uploadFile2() {
    console.log(this.file2);

    var formdata = new FormData();


    formdata.append("project_drawing", this.file2);

    let requestOptions: RequestInit = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://cloneback.turnkey.no/api/admin/upload-project-drawing/" + this.data, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));


    this.modalService.dismissAll();

    this.toast.success('File Uploaded Successfully!', 'Success')
    setInterval(() => {
      window.location.reload();
    }, 5000);
  }

  cancel2() {
    this.file2 = null;
    this.modalService.dismissAll();
  }

  //Header functions

  logout() {
    this.shared.logOut();
  }


  changeLang(img: any, lang: any) { }
  //

  viewSteps(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class1'
    })
  }

  view(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class1'
    })
  }



  yt = '';

  getProjectDrawing() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-project-drawing/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data[0]);
      let b: string = 'src="' + data[0] + '"'
      console.log(b);

      let a = '<iframe src frameBorder="0" scrolling="auto" height="100%" width="100%" ></iframe>'
      a = a.replace(/(src)/, b)

      this.yt = a;
    })
  }


  yt2 = '';

  getProjectOffer() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-project-offer/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data[0]);
      let b: string = 'src="' + data[0] + '"'
      console.log(b);

      let a = '<iframe src frameBorder="0" scrolling="auto" height="100%" width="100%" ></iframe>'
      a = a.replace(/(src)/, b)

      this.yt2 = a;
    })
  }


  imageSrc: string = '';
  fileSource: any;
  onFileChange(event: any) {
    const reader = new FileReader();

    // if(event.target.files[0].size < 2097152){
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files[0];
      // reader.readAsDataURL(this.file);

      // reader.onload = () => {

      //   this.imageSrc = reader.result as string;


      //     this.fileSource= reader.result
      this.uploadProjectPicture(this.file)

      // };

    }

    // }

    // else{
    //   this.toast.error('Image Size is larger than 2mb');
    // }
  }


  uploadProjectPicture(imgUrl: any) {
    console.log(imgUrl);
    var formdata = new FormData();


    formdata.append("employee_id", this.shared.customerData.id);
    formdata.append("project_id", this.data);
    formdata.append("image", imgUrl);
    let requestOptions: RequestInit = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://cloneback.turnkey.no/api/admin/upload-project-picture", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));


    this.modalService.dismissAll();

    setInterval(() => {
      window.location.reload();
    }, 2000);
    this.toast.success('Project Picture Uploaded Successfully!', 'Success')

  }


  activePictures: any;

  getPP() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-project-images/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data)

      this.activePictures = data[0]
    });
  }


  extraWork: any
  getExtraWork() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-extra-work/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data)

      this.extraWork = data[0]
    });
  }

  formDta = {
    task_Details: '',
    hours: 0,
    date: Date,
    created_By: this.shared.customerData.first_name
  }
  addExtraWork() {
    console.log(this.formDta.task_Details)
    console.log(this.formDta.hours)
    console.log(this.formDta.date)

    if (this.formDta.task_Details == '' || this.formDta.task_Details == undefined || this.formDta.task_Details == null) {
      this.toast.error('Please Enter Task Detail')
      return;
    }
    if (this.formDta.hours == 0 || this.formDta.hours == undefined || this.formDta.hours == null) {
      this.toast.error('Please Enter Working Hours')
      return;
    }

    if (this.formDta.date == undefined || this.formDta.date == null) {
      this.toast.error('Please Enter Working Date')
      return;
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/admin/add-extra-work',
      {
        task_details: this.formDta.task_Details,
        hours: this.formDta.hours,
        date: this.formDta.date,
        created_by: this.formDta.created_By,
        employee_id: this.shared.customerData.id,
        project_id: this.data
      }, { headers: headers }).subscribe((data: any) => {
        console.log(data)

        window.location.reload();

        this.toast.success('Extra Work Added Successfully');
      })
  }


  orders: any;

  getOrders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-order-details/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data)

      this.orders = data[0]
    });
  }

  frmData = {
    order_details: '',
    price: 0,
    created_By: this.shared.customerData.first_name

  }

  addOrder() {
    console.log(this.frmData.order_details)
    console.log(this.frmData.price)


    if (this.frmData.order_details == '' || this.frmData.order_details == undefined || this.frmData.order_details == null) {
      this.toast.error('Please Enter Order Detail')
      return;
    }
    if (this.frmData.price == 0 || this.frmData.price == undefined || this.frmData.price == null) {
      this.toast.error('Please Enter Order Price')
      return;
    }


    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/admin/add-order-detail',
      {
        order_detail: this.frmData.order_details,
        price: this.frmData.price,

        created_by: this.frmData.created_By,
        employee_id: this.shared.customerData.id,
        project_id: this.data
      }, { headers: headers }).subscribe((data: any) => {
        console.log(data)

        window.location.reload();

        this.toast.success('Order Added Successfully');
      })
  }



  //Company Team
  CompanyTeam: any[] = []

  AddCW() {
    console.log(this.data)
    console.log(this.slctWorkerID)
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/manager/assign-company-worker/' + this.data, {

      "company_worker_id": this.slctWorkerID,
    }, { headers: headers }).subscribe((data: any) => {
      this.modalService.dismissAll();

      window.location.reload()
      console.log(data)

    },
      (error: any) => {
        console.log('oops', error)
        //    
      })

    this.toast.success('Company Worker Added Successfully!', 'Success');
  }

  AllnonCT: any[] = []
  getEmployeeForCT(id: any) {

    console.log(this.company_worker_id)
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/employee-for-company/' + this.data + '?by_company=' + id
      , { headers: headers }).subscribe((data: any) => {
        console.log(data)

        this.AllnonCT = data.data
      })
  }


  selectCTeamId: any
  selectCTeam(id: any) {
    this.selectCTeamId = id;
  }

  AddCTeam() {
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    if (this.projectDetails.id == '' || this.projectDetails.id == undefined || this.projectDetails.id == null) {
      this.toast.warning('Project Id is undefined', 'Warning')
      return;
    }
    else {



      //     console.log(this.slctTeamID);

      this.http.post('https://cloneback.turnkey.no/api/admin/company-team', {
        "project_id": this.data,
        "employee_id": this.selectCTeamId,
      }, { headers: headers }).subscribe((data: any) => {
        this.modalService.dismissAll();

        //      console.log(data);
        window.location.reload()

      },
        (error: any) => {
          console.log('oops', error)

        })
    }
    this.toast.success('Company Team Member Added Successfully!', 'Success');
  }

  CTEmployees: any[] = []
  getCTeam() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/admin/get-company-team/' + this.data, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      this.CTEmployees = data[0].team
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }
}
