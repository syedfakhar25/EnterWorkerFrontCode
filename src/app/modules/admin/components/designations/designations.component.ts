import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  designation_name: any;

  dummyDesignations: any []= [ ]


  doughnutChartLabels: Label[] = [];

  doughnutChartData: MultiDataSet = [

  ];

  doughnutChartOptions: ChartOptions = {
    responsive: true
  }

  doughnutChartColors:any = [
    {
      backgroundColor: [],
    }
  ];

  doughnutChartLegend = false;
  doughnutChartType: ChartType = 'doughnut';


  page = 1;
  pageSize = 20
  collectionSize = 0;


  formData={
    designation:'',
    color:'',
    id:''
  }

  select1:boolean=false;
  
  closeResult: string = '';
  constructor(public config: ConfigService,public shared:SharedDataService,
     public router: Router,private http:HttpClient, public toast: ToasterService,public modalService:NgbModal) {

  
   

    this.getDesignations()

    console.log(this.doughnutChartData)
    console.log(this.doughnutChartLabels)


    
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


  getDesignations(){

    // this.config.getHttp('admin/designations','').then((data:any)=>{
    //   console.log(data)
    // })

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    this.http.get('https://cloneback.turnkey.no/api/admin/designations', {
      headers: headers
      }).subscribe((data:any) => {
        console.log(data)
       
        for(let b=0;b<data[0].length;b++){
          if(data[0][b].designation_name == 'super admin' || data[0][b].designation_name == 'project manager' || data[0][b].designation_name == 'customer' || data[0][b].designation_name == 'company worker'){
           
          }
          else{
            console.log(data[0][b])
            this.dummyDesignations.push(data[0][b])
          }
        }

        console.log(this.dummyDesignations)
         
        for (let a = 0; a < data[1].length; a++) {
          if(data[1][a].designation_name == 'super admin' || data[1][a].designation_name == 'project manager'|| data[1][a].designation_name == 'customer' || data[1][a].designation_name == 'company worker'){
           
          }
          else{
            this.doughnutChartLabels.push(data[1][a].designation_name);
            this.doughnutChartData.push(data[1][a].total);
            this.doughnutChartColors[0].backgroundColor.push(data[1][a].color)
         // console.log(this.dummyDesignations[a].desigation_name)
         // console.log(this.dummyDesignations[a].value)
         // console.log(this.dummyDesignations[a].color)
          }
       }
      
      },
      (error: any) => {
        console.log('oops', error)
        
      }
    );  
    
  }

  Edit(data: any,content:any) {
    console.log(data)
    this.formData.designation = data.designation_name;
    this.formData.color = data.color;
     this.formData.id = data.id
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


  Delete(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    this.http.delete('https://cloneback.turnkey.no/api/admin/designations/'+id, {
      headers: headers
      }).subscribe((data:any) => {
       window.location.reload();
      
       
       
      
      },
      (error: any) => {
        console.log('oops', error)
        
      }
    );  
    this.toast.success('Designation Deleted Successfully!','Success')
  }

  addDesignation(content:any){
    this.formData.designation=''
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  Selectcolor(){
    console.log(document.getElementById('favcolor'));
   }

   adddesignation(){
console.log(this.formData.designation);

var b:any = document.getElementById('favcolor');

var a = b.value;

console.log(a);

const headers = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('Accept', 'application/json');

this.http.post('https://cloneback.turnkey.no/api/admin/designations',{
  'designation_name':this.formData.designation,
  'color':a
}, {
  headers: headers
  }).subscribe((data:any) => {
   window.location.reload();
  
   
   
  
  },
  (error: any) => {
    console.log('oops', error)
    
  }
);  
this.toast.success('Designation Added Successfully!','Success')
   }

   editDesignation(){
    console.log(this.formData.designation);

    var b:any = document.getElementById('favcolor');
    
    var a = b.value;
    
    console.log(a);
    
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    this.http.put('https://cloneback.turnkey.no/api/admin/designations/'+this.formData.id,{
      'designation_name':this.formData.designation,
      'color':a
    }, {
      headers: headers
      }).subscribe((data:any) => {
       window.location.reload();
      
       
       
      
      },
      (error: any) => {
        console.log('oops', error)
        
      }
    );  
    this.toast.success('Designation Editted Successfully!','Success')
   }


    //Header functions
  
  logout(){
    this.shared.logOut();
  }


  changeLang(img:any,lang:any){}
}
