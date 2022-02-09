import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FeedService } from 'src/app/feed.service';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {

  role:any;
  profilePic:boolean=true;
  notifications:any[]=[];

  a=1;
    constructor(public router:Router,public shared:SharedDataService,
      public toast:ToasterService,
      public feedService:FeedService,public config:ConfigService) { 
  console.log(this.shared.customerData)
 this.role= this.shared.role;
// console.log(this.role);
//this.getTodayNotifications()


  }
key="total"
  ngOnInit(): void {
    this.feedService.channel.bind('chat-event', (data:any)=> {
      
      console.log('ye aya')
      if(data.chat.chatwith_id == this.shared.customerData.id){
        this.toast.success('New Message Received From'+ data.chat.user?.first_name + '' + data.chat.user?.last_name,'')
      }
    })
  }
  hideProfile(){
    if(this.profilePic == true){
      this.profilePic = false;
    }
   else  if(this.profilePic == false){
    this.profilePic = true;
  }
  }

  openTasks(){
    localStorage.removeItem('keyID');
        localStorage.setItem('keyID', JSON.stringify(this.key));
        this.router.navigate(['admin/tasks']);
  }

  logout(){
    this.shared.logOut();
   
   
  }

  getTodayNotifications(){
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
    else{
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

    let startTime = h+':'+m+':'+s;
   
    let startdatetime = date + ' ' + startTime;
    let start;
   start = startdatetime;

   if(this.role == 'admin'){
    this.config.postSecondHttp('admin/event-notification',{
      'current_date':start
    }).then((data:any)=>{
      // console.log(data.data);
      this.notifications = data.data;
      this.notifications.sort(function(a,b) { 
       return new Date(a.start).getTime() - new Date(b.start).getTime() 
   });
    })
   }

   if(this.role == 'project manager'){
    this.config.postSecondHttp('manager/event-notification',{
      'current_date':start,
      'manager_id':this.shared.customerData.id
    }).then((data:any)=>{
      console.log(data.data);
      this.notifications = data.data;
      this.notifications.sort(function(a,b) { 
       return new Date(a.start).getTime() - new Date(b.start).getTime() 
   });
    })
   }

   if(this.role == 'employee'){
    this.config.postSecondHttp('employee/event-notification',{
      'current_date':start,
      'employee_id':this.shared.customerData.id
    }).then((data:any)=>{
      console.log(data.data);
      this.notifications = data.data;
      this.notifications.sort(function(a,b) { 
       return new Date(a.start).getTime() - new Date(b.start).getTime() 
   });
    })
   }

   if(this.role == 'customer'){
    this.config.postSecondHttp('customer/event-notification',{
      'current_date':start,
      'customer_id':this.shared.customerData.id
    }).then((data:any)=>{
      console.log(data.data);
      this.notifications = data.data;
      this.notifications.sort(function(a,b) { 
       return new Date(a.start).getTime() - new Date(b.start).getTime() 
   });
    })
   }
   
  }


  editProfile(){
    this.router.navigate(['admin/edit-profile'])
  }

  AllProjects(){
    let a = 'total'
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/projects'], navigationExtras);
   
  }

  AllDesignations(){
    this.router.navigate(['admin/designations'])
  }

 
}
