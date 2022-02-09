import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {



  page = 1;
pageSize = 20
collectionSize = 0;

//
project_name:any;

  role:any;
  ID:any
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  key: any

  Projects: any[] = [];



  EmployeeDummyProjects:any=[
    {
   name:'Project A',
   customer:{first_name:'Jacob',last_name:'kayne'},
   start_date:'17/04/1986',
   end_date:'17/04/1986',
   manager:{name:'Haider',img:"../../../../../assets/img/user1-128x128.jpg"}
  },
  {
    name:'Project B',
    customer:{first_name:'Jacob',last_name:'kayne'},
    start_date:'17/04/1986',
    end_date:'17/04/1986',
    manager:{name:'Haider',img:"../../../../../assets/img/user1-128x128.jpg"}
   },
   {
    name:'Project C',
    customer:{first_name:'Jacob',last_name:'kayne'},
    start_date:'17/04/1986',
    end_date:'17/04/1986',
    manager:{name:'Haider',img:"../../../../../assets/img/user1-128x128.jpg"}
   },
   {
    name:'Project D',
    customer:{first_name:'Jacob',last_name:'kayne'},
    start_date:'17/04/1986',
    end_date:'17/04/1986',
    manager:{name:'Haider',img:"../../../../../assets/img/user1-128x128.jpg"}
   },

]
  constructor(public config: ConfigService,
    private http:HttpClient,
    public shared:SharedDataService,public route:ActivatedRoute, public router: Router, public toast: ToasterService) {
     console.log(this.shared.customerData.id) 
    this.role= this.shared.role;
    this.ID = this.shared.customerData.id;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.key = this.router.getCurrentNavigation()?.extras.state?.user;

        localStorage.removeItem('PID');
        localStorage.setItem('PID', JSON.stringify(this.key));

      }


    });
    this.key = JSON.parse(localStorage.getItem('PID') || '{}');
   

    if (this.role == 'admin') {
     
      if (this.key == 'total') {
        this.getAllProjects()
       
      }
      if (this.key == 'ongoing') {
        this.getAllProjects()
      }

    }
    if (this.role == 'customer') {
      if (this.key == 'total') {
        this.getcustomerTotalProjects();
      }
      if (this.key == 'ongoing') {
        this.getonGoingProjects();
      }
      if (this.key == 'completed') {
        this.getcompletedProjects();
      }
      
    }
    if (this.role == 'project manager') {
      if (this.key == 'total') {
        this.getmanagerTotalProjects();
      }
      if (this.key == 'ongoing') {
        this.getmanageronGoingProjects();
      }
      if (this.key == 'completed') {
        this.getmanagercompletedProjects();
      }
      
    }

    if(this.role == 'employee'){
      this.getEmployeeProjects();
      
    }

    if(this.role == 'company worker'){
      this.getCompanyWorkerProjects()
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

  checkImg(b: any) {
    console.log(b);
  }


  getAllProjects() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-projects/'+this.ID, { headers: headers }).subscribe((data: any) => {

    
      console.log(data.data)
     

      
      
      if (this.key == 'total') {
        this.Projects = data.data;
        console.log(data.data)
       
        return;
      }
      if (this.key == 'ongoing') {
        let a:any[]=[]
        a = data.data;
        for(let i=0;i<a.length;i++){
          if(a[i].status != '2'){
            this.Projects.push(a[i])
          }
        }
        console.log(this.Projects)
        
     }
     
    })
  }



  

  deleteProject(id: any) {
    this.config.deleteSecondHttp('manager/projects/' + id, '').then((data: any) => {
      window.location.reload();
      this.toast.success('Project Deleted Successfully!');
    })
  }

  EditProject(a: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/edit-project'], navigationExtras);

  }
  openDetails(a: any) {
    console.log(a)
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/project-details'], navigationExtras);
  }

  PinProject(id: any) {
   if(this.role == 'project manager'){
      const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/pin-project'
    ,{
      user_id: this.ID,
      "project_id": id
    }, { headers: headers }).subscribe((data: any) => {
        console.log(data);
         window.location.reload();
        
      })
      this.toast.success('Pinned Project Successfully!', 'Success')
    }
    else if(this.role == 'admin'){
      const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/pin-project'
    ,{
      user_id: this.ID,
      "project_id": id
    }, { headers: headers }).subscribe((data: any) => {

     
        console.log(data);
         window.location.reload();
       
      })
      this.toast.success('Pinned Project Successfully!', 'Success')
    }
    
  
  }

  UnPinProject(id:any){
    if(this.role =='customer'){
      this.config.postSecondHttp('pin-project', {
        user_id: this.ID,
        "project_id": id
      }).then((data: any) => {
        console.log(data);
        window.location.reload();
    
        this.toast.success('Un Pinned Project Successfully!', 'Success')
      })
    }
    else if(this.role == 'project manager'){
      this.config.postSecondHttp('pin-project', {
        user_id: this.ID,
        "project_id": id
      }).then((data: any) => {
        console.log(data);
       window.location.reload();
   
        this.toast.success('Un Pinned Project Successfully!', 'Success')
      })
    }
    else if(this.role == 'admin'){
      this.config.postSecondHttp('pin-project', {
        user_id:this.ID,
        "project_id": id
      }).then((data: any) => {
        console.log(data);
       window.location.reload();
    
        this.toast.success('Un Pinned Project Successfully!', 'Success')
      })
    }
    
  }
  


  getEmployeeProjects(){

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/employee/total-tasks/' + this.shared.customerData.id, { headers: headers }).subscribe((data: any) => {
      console.log(data[0].projects)
     this.Projects = data[0].projects
    
    })
   
  }
  getcustomerTotalProjects() {
    this.config.getSecondHttp('customer/total-projects/' + this.ID, '').then((data: any) => {
      this.Projects = data.data;
      console.log(data.data)
    })
  }
  getonGoingProjects(){
    this.config.getSecondHttp('customer/ongoing-projects/' + this.ID, '').then((data: any) => {
      this.Projects = data.data;
      console.log(data.data)
    })
  }
  getcompletedProjects(){
    this.config.getSecondHttp('customer/completed-projects/' + this.ID, '').then((data: any) => {
      this.Projects = data.data;
      console.log(data.data)
    })
  }

  getmanagerTotalProjects(){
    this.config.getSecondHttp('manager/get-manager-projects/' + this.ID, '').then((data: any) => {
      this.Projects = data.data;
      console.log(data.data)
    })
  }
  getmanageronGoingProjects(){
    console.log('ye aya')
    this.config.getSecondHttp('manager/ongoing-projects/' + this.ID, '').then((data: any) => {
      this.Projects = data.data;
      console.log(data.data)
    })
  }
  getmanagercompletedProjects(){
    this.config.getSecondHttp('manager/completed-projects/' + this.ID, '').then((data: any) => {
      this.Projects = data.data;
      console.log(data.data)
    })
  }

  openPDetails(){
    this.router.navigate(['admin/project-details']);
  }

  refreshCountries() {
   
  }


  addProject(){
    if(this.role == 'admin'){
      this.router.navigate(['admin/add-project']);
    }
    
  }


 //Header functions
  
 logout(){
  this.shared.logOut();
}

 changeLang(img:any,lang:any){}



 //Company Worker functions
 getCompanyWorkerProjects(){
  this.config.getSecondHttp('company/get-company-worker-projects/' + this.ID, '').then((data: any) => {
    this.Projects = data.data;
    console.log(data.data)
  })
 }
}
