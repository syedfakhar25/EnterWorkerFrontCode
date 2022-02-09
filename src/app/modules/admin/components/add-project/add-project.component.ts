import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {


role:any;
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();
  
  
 managername= new FormControl('');
formData={
  clientname: '',
 projectname:'',
 startdate:'',
 enddate:'',
 projectdesc:'',
 street:'',
 city:'',
 postalcode:'',
 customer_id:null,
 manager_id:null
}
  
AllCustomers:any[]=[];
AllManagers:any[]=[];
  constructor(public router:Router,private http:HttpClient,
    public config:ConfigService,public toast:ToasterService,public shared:SharedDataService) {
    this.role = this.shared.role
    this.fetchAllCustomers()
  //  this.fetchAllManagers();
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

  submit(){
    if(this.formData.projectname == '' || this.formData.projectname == null || this.formData.projectname == undefined){
      this.toast.warning('Project Name is missing','Error')
      return;
    }
    if(this.formData.clientname == '' || this.formData.clientname == null || this.formData.clientname == undefined){
      this.toast.warning('Client Name is missing','Error')
      return;
    }
  
    if(this.formData.startdate == '' || this.formData.startdate == null || this.formData.startdate == undefined){
      this.toast.warning('Start Date is missing','Error')
      return;
    }
    if(this.formData.enddate == '' || this.formData.enddate == null || this.formData.enddate == undefined){
      this.toast.warning('End Date is missing','Error')
      return;
    }
    if(this.formData.projectdesc == '' || this.formData.projectdesc == null || this.formData.projectdesc == undefined){
      this.toast.warning('Project Description is missing','Error')
      return;
    }
    if(this.formData.street == '' || this.formData.street == null || this.formData.street == undefined){
      this.toast.warning('Street Address is missing','Error')
      return;
    }
  
    if(this.formData.postalcode == '' || this.formData.postalcode == null || this.formData.postalcode == undefined){
      this.toast.warning('Postal Code is missing','Error')
      return;
    }
    if(this.formData.city == '' || this.formData.city == null || this.formData.city == undefined){
      this.toast.warning('City is missing','Error')
      return;
    }
    var d1 = new Date(this.formData.startdate);
    var d2 = new Date(this.formData.enddate);

    if(d1.getTime()>d2.getTime()){
      this.toast.warning('Project End Date Cannot Be Greater Than Start Date!','Error')
      return;
    }
   
    else{
      // if(this.role == 'project manager'){
      // this.formData.manager_id =this.shared.customerData.id
      // }
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/manager/projects',{
        "customer_id": this.formData.clientname,
        "name": this.formData.projectname,
        
        "description": this.formData.projectdesc,
        "street": this.formData.street,
        "postal_code": this.formData.postalcode,
        "city": this.formData.city,
        "start_date": this.formData.startdate,
        "end_date": this.formData.enddate
      },{ headers: headers}).subscribe((data:any)=>{

    
       console.log(data.data)

       this.toast.success('Project has been added successfully!','Success')
       const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  this.http.post('https://cloneback.turnkey.no/api/manager/steps',{
    'project_id':data.data.id,
    'active':1,
    'step_order':1,
    'task_status':1
  },{ headers: headers}).subscribe((data:any)=>{
    console.log(data);

    // setInterval(() => {
    //   let a = 'total'
    //   let navigationExtras: NavigationExtras = {
    //     state: {
    //       user: a
    //     }
    //   };
      this.router.navigate(['admin/projects']);
  //  }, 5000);
   })

 
            
          
     })
    }
 
   
  }
  cancel(){
    this.router.navigate(['admin/employees'])
    
  }

  fetchAllCustomers(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/all-customer',
    { headers: headers}).subscribe((data:any)=>{

    
      this.AllCustomers = data.data
      
    })
  }

  SelectClient(a:any){
    console.log(a);
    var i=0
    for(i;i<this.AllCustomers.length;i++){
     if(this.AllCustomers[i].first_name == a){
      
       this.formData.customer_id = this.AllCustomers[i].id;
     }
    }
    
  }

  fetchAllManagers(){
    this.config.getSecondHttp('all-manager','').then((data:any)=>{
      this.AllManagers = data.data
      
     

    })
  }

  SelectManager(a:any){
   
    console.log(a);
    var i=0
    for(i;i<this.AllManagers.length;i++){
     if(this.AllManagers[i].first_name == a){
      
       this.formData.manager_id = this.AllManagers[i].id;
     }
    }
    
  }

  //Header functions
  
 logout(){
  this.shared.logOut();
 }


 changeLang(img:any,lang:any){}
  
}
