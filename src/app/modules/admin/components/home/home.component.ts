import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { map, share, startWith } from "rxjs/operators";
import { Label, MultiDataSet, Color } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/providers/config/config.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { NavigationExtras, Router } from '@angular/router';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { SlideInOutAnimation } from '../animations';

//download
import { FileSaverService } from 'ngx-filesaver';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [SlideInOutAnimation]
})
export class HomeComponent implements OnInit, OnDestroy {

  //New Carousal//
  responsiveOptions: any;

  longText = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose(injected humour and the like). packages and web page editors now use Lorem Ipsum as their default model text, and a"

  AllEmp: any[] = [
    {
      img: '../../../../../assets/img/tom.jpg',
      first_name: "Haider Ali",
      designation: "Plumber"
    },
    {
      img: '../../../../../assets/img/tom.jpg',
      first_name: "Haider Ali",
      designation: "Plumber"
    },
    {
      img: '../../../../../assets/img/tom.jpg',
      first_name: "Haider Ali",
      designation: "Plumber"
    },
    {
      img: '../../../../../assets/img/tom.jpg',
      first_name: "Haider Ali",
      designation: "Plumber"
    },
    {
      img: '../../../../../assets/img/tom.jpg',
      first_name: "Haider Ali",
      designation: "Plumber"
    }
  ]
  //New Carousal//

  animationState = 'out';

  @ViewChild("projectModal", { static: true }) content: ElementRef | undefined;

  page = 1;
  pageSize = 5
  collectionSize = 0;
  //
  role: any;
  checked: boolean = true;
  event: any;
  id: any;
  ID: any;
  closeResult: string = '';
  Dashboarddata: any;
  doughnutChartLabels: Label[] = [];
  labels: any[] = []
  doughnutChartData: MultiDataSet = [

  ];

  doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  doughnutChartColors: any = [
    {
      backgroundColor: [],
    },
  ];

  doughnutChartLegend = false;
  doughnutChartType: ChartType = 'doughnut';


  project: any[] = []

  recentChats: any[] = []
  tasks: any[] = [];




  search: boolean = false;
  projectname: any;

  constructor(private modalService: NgbModal,
    public shared: SharedDataService,
    public http: HttpClient,
    private _FileSaverService: FileSaverService,
    public router: Router, public config: ConfigService, public toast: ToasterService) {
    this.role = this.shared.role;
    this.ID = this.shared.customerData.id;
    if (this.role == 'admin') {
      this.getPinnedProjects();
      this.superDashboard()

    }
    if (this.role == 'project manager') {
      this.getPinnedProjects();
      this.managerDashboard()

    }

    
    if (this.role == 'customer') {
      this.getcustomerTotalProjects()
      this.getPinnedProjects();
      this.ProjectId = JSON.parse(localStorage.getItem('ProjectID') || '{}');
      console.log(this.ProjectId)



      this.getProjectdetatails();

      this.getAllManagers()


      this.getTeamMembers()
      this.getSteps()



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
    if (this.role == 'employee') {
      this.employeeDashboard()
    }

   // this.getRecentChat()

  }
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();
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


  CheckTask(event: any, id: any, content: any) {
    this.event = null;
    this.id = null;
    this.event = event;
    this.id = id;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      size: 'md',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  TaskDone() {
    if (this.event.target.checked) {
      console.log(this.event)
      let i = 0;
      for (i; i < this.tasks.length; i++) {
        if (this.tasks[i].id == this.id) {
          this.tasks[i].status = 'completed'
          this.modalService.dismissAll()
          this.config.postSecondHttp('update-task-status', {
            "task_id": this.id,
            "task_status": 1
          }).then((data: any) => {
            window.location.reload();
            this.router.navigate(['']);
            this.toast.success('Task Status Changed!', 'Success')
          })
        }
        else {

        }
      }
    }
    else {
      console.log('not checked')
    }
  }
  TaskCancel() {

    window.location.reload();
  }

  private getDismissReason(reason: any) {
    //   if (reason === ModalDismissReasons.ESC) {
    //     return 'by pressing ESC';
    //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //     return 'by clicking on a backdrop';
    //   } else {
    //     return  `with: ${reason}`;
    //   }
  }

  

  getPinnedProjects() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  this.http.get('https://cloneback.turnkey.no/api/get-user-pin-project/' + this.shared.customerData.id,{ headers: headers}).subscribe((data:any)=>{

   console.log(data.data)

      this.project = data.data
    })
  }
  removeFromPinned(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  this.http.post('https://cloneback.turnkey.no/api/pin-project',{
    user_id: this.ID,
    "project_id": id
  },{ headers: headers}).subscribe((data:any)=>{

    console.log(data);
  

      window.location.reload();

      
    })
    this.toast.success('Un Pinned Project Successfully!', 'Success')
  }

  superDashboard() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  this.http.get('https://cloneback.turnkey.no/api/admin/dashboard/' + this.ID,{ headers: headers}).subscribe((data:any)=>{
     
      console.log(data)
      this.Dashboarddata = data.data;

      for (let a = 0; a < data.data.user_designations.length; a++) {
        if (data.data.user_designations[a].designation_name == 'super admin' || data.data.user_designations[a].designation_name == 'project manager' || data.data.user_designations[a].designation_name == 'customer') {



        }
        else {

          this.doughnutChartColors[0].backgroundColor.push(data.data.user_designations[a].color)

          this.labels.push(data.data.user_designations[a].designation_name);
          this.doughnutChartData.push(data.data.user_designations[a].total)
          this.doughnutChartLabels.push(data.data.user_designations[a].designation_name)
        }
      }


    })
  }
  customerDashboard() {
    this.config.getSecondHttp('customer/dashboard/' + this.ID, '').then((data: any) => {

      this.Dashboarddata = data.data;
      console.log(data.data)


    })
  }
  employeeDashboard() {
    this.config.getSecondHttp('employee/dashboard/' + this.shared.customerData.id, '').then((data: any) => {
     console.log(data.data)
     this.Dashboarddata= data.data
    })
  }
  managerDashboard() {
    this.config.getSecondHttp('manager/dashboard/' + this.ID, '').then((data: any) => {
      this.Dashboarddata = data.data;

      console.log(data.data)

    })
  }

  openTotalTasks() {
    let a = 'total'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/tasks'], navigationExtras);
  }

  opencompletedTasks() {
    let a = 'completed'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/tasks'], navigationExtras);
  }

  openOngoingTasks() {
    let a = 'ongoing'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/tasks'], navigationExtras);
  }


  openTotalProjects() {
    let a = 'total'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/projects'], navigationExtras);
  }
  openOngoingProjects() {
    let a = 'ongoing'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/projects'], navigationExtras);
  }

  openCompletedProjects() {
    let a = 'completed'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/projects'], navigationExtras);

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
  adminOngoingProjects() {
    let a = 'ongoing'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/projects'], navigationExtras);
  }

  getRecentChat() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.shared.token}`
    });
    // console.log(this.shared.token)

    this.http.get('https://cloneback.turnkey.no/api/recent-chat', { headers }).subscribe((data: any) => {

      //   console.log(data.data)
      this.recentChats = data.data


    })
  }

  openEmployees() {
    this.router.navigate(['admin/employees'])
  }
  openCustomers() {
    this.router.navigate(['admin/customers'])
  }

  openChat() {
    this.router.navigate(['admin/chat'])
  }

  data: any;

  confirmProject(content: any, a: any) {
    // console.log(content);
    this.data = a;
    console.log(this.data);
    console.log(this.data.name);
   
    this.data.employee.push(this.data.manager)
    console.log(this.data.employee)
    const element = <HTMLElement>document.getElementsByClassName('cot')[0];
    element.style.filter = 'blur(10px)';
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  cancel() {
    const element = <HTMLElement>document.getElementsByClassName('cot')[0];
    element.style.filter = 'none';
    this.modalService.dismissAll();

  }

  openPersonChat(a: any) {
    console.log(a);
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/chat'], navigationExtras);
  }



  Projects: any[] = []
  //New Additions
  getcustomerTotalProjects() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/customer/total-projects/' + this.shared.customerData.id, { headers: headers }).subscribe((data: any) => {

      console.log(data)
      this.Projects = data[0];

      for (let a = 0; a < this.Projects.length; a++) {
        if (this.Projects[a].active == 0) {
          this.confirmProject(this.content, this.Projects[a]);
          return;
        }
      }
    })



  }

  ProjectId: any;

  getProjectDetails() {
    console.log(this.ProjectId)
    localStorage.removeItem('ProjectID');
    localStorage.setItem('ProjectID', JSON.stringify(this.ProjectId));
    window.location.reload();

  }

  acceptProject(id: any) {
    const element = <HTMLElement>document.getElementsByClassName('cot')[0];
    element.style.filter = 'none';
    this.modalService.dismissAll();
    this.config.putSecondHttp('customer/accept-project/' + id, '').then((data: any) => {
      console.log(data);
    })
  }

  rejectProject(id: any) {
    
    this.config.putSecondHttp('customer/reject-project/' + id, '').then((data: any) => {
      console.log(data);
      window.location.reload();
    })
  }


  //Project Details se data aya wa

  workingdays: any;
  projectDetails: any;
  deadline: any;
  startingline: any;
  remaining: any;

  Tasks: any[] = []
  getProjectdetatails() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/manager/projects/' + this.ProjectId, { headers: headers }).subscribe((data: any) => {


      console.log(data.data)
      this.projectDetails = data.data;
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


  projectManagers: any;
  collectionSize1 = 0;
  getAllManagers() {
    // const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Accept', 'application/json');
    // this.http.get('https://cloneback.turnkey.no/api/admin/employees', { headers: headers }).subscribe((data: any) => {

    //    console.log(data)
    //   for (let a = 0; a < data[0].length; a++) {
    //     if (data[0][a].designation_name == 'project manager') {
    //       console.log(data[0][a])
    //       this.projectManagers.push(data[0][a])
    //     }
    //     else {

    //     }

    //   }



    //       console.log(this.projectManagers.length)
    //   this.collectionSize1 = this.projectManagers.length
    // })

  }


  Employees:any[]=[];
   Manager:any;

  getTeamMembers() {
    console.log(this.data)
    console.log('ye aya')
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/manager/get-team/' + this.ProjectId, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      
      //  for(let a =0;a<data[0].length;a++){
      //    console.log(data[0][a])
      //    this.Employees.push(data[0][a])
      //  }
      let a: any[] = [];
      let b:any[]=[];

      //  b = data[0].manger[0]
    // this.Employees.push(b)
     console.log( this.Employees)
     
     this.Manager = data[0].manger;
     console.log(this.Manager[0]?.first_name)
      this.Employees = data[0].team;
   
      console.log(this.Employees)
    },
      (error: any) => {
        console.log('oops', error)
      //  this.toast.error(error.error.errors.email[0], 'Oops');
      }

    );
  }

  steps: any;

  getSteps() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-steps/' + this.ProjectId, { headers: headers }).subscribe((data: any) => {
      console.log(data[0]);
      this.steps = data[0]
     
    })
  }


  getProjectOffer() {
     var document:any;
     document='https://cloneback.turnkey.no/api/admin/get-project-offer/'
     const fileName = `ProjectOffer` + `.pdf`;
    console.log(fileName)
    this.http.get(document+this.ProjectId, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      console.log(res);
      this._FileSaverService.save(res.body, fileName);
    });
    return;

  
  
 
  }

  getProjectDrawing() {
    var document;
    document='https://cloneback.turnkey.no/api/admin/get-project-drawing/'
    const fileName = `ProjectDrawing` + `.jpg`;
    console.log(fileName)
    this.http.get(document+this.ProjectId, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      this._FileSaverService.save(res.body, fileName);
    });
    return;
  }


  //Header functions
  
  logout(){
    this.shared.logOut();
  }


  changeLang(img:any,lang:any){}
}


