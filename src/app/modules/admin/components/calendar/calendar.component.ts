import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import { HttpClient } from '@angular/common/http';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject, Subscription, timer } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {

  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

import { FormControl ,Validators,ValidationErrors} from '@angular/forms';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { map, share } from 'rxjs/operators';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#f542ec',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  role:any;
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();


  @ViewChild('modalContent', { static: true }) modalContent:any;

view: CalendarView = CalendarView.Month;

CalendarView = CalendarView;

viewDate: Date = new Date();

modalData: { [k: string]: any } = {}

event:any[]=[];
actions: CalendarEventAction[] = [
  {
    label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    a11yLabel: 'Edit',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.handleEvent('Edited', event,'');
    },
  },
  {
    label: '<i class="fas fa-fw fa-trash-alt"></i>',
    a11yLabel: 'Delete',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.handleEvent('Deleted', event,'');
    },
  },
];

refresh: Subject<any> = new Subject();

events: CalendarEvent[] = [];

activeDayIsOpen: boolean = true;
//

clickedItem='month';

//Calendar Variables from Brodene Skog//
select1:boolean=true;
select2:boolean=false;
select3:boolean=false;
select4:boolean=false;
select5:boolean=false;
locale='';
clrr:any;
color: any;
starttime = new FormControl('', [Validators.required])
endtime = new FormControl('',[Validators.required])
desc = new FormControl('')
subject = new FormControl('')
Event: any;
eventType = new FormControl('')
eventtt: any;
constructor(
  private domSanitizer: DomSanitizer,
  private http: HttpClient,
  private modal: NgbModal,
  public shared:SharedDataService,
  public toast:ToasterService,
  public modalService:NgbModal,
  public config:ConfigService ) {
    this.role = this.shared.role;
    this.getAllEvents()
 }

 dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  if (isSameMonth(date, this.viewDate)) {
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
    }
    this.viewDate = date;
  }
}

eventTimesChanged({
  event,
  newStart,
  newEnd,
}: CalendarEventTimesChangedEvent): void {
  this.events = this.events.map((iEvent) => {
    if (iEvent === event) {
      return {
        ...event,
        start: newStart,
        end: newEnd,
      };
    }
    return iEvent;
  });
  this.handleEvent2('Dropped or resized', event);
}

handleEvent2(action: string, event: CalendarEvent): void {
  
  this.modalData.action = action;
  this.modalData.event = event;
  
}

addEvent(): void {
  this.events = [
    ...this.events,
    {
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    },
  ];
}



setView(view: CalendarView,setting:any) {
  this.view = view;
  this.clickedItem=setting;
}

closeOpenMonthViewDay() {
  this.activeDayIsOpen = false;
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

getAllEvents(){
  if(this.role == 'admin'){
    this.config.getSecondHttp('manager/calenderevents','').then((data:any)=>{
      console.log(data.data)
      this.event = data.data;
     
      for(var i = 0; i <this.event.length; i++)
      {
        this.event[i].start = new Date(this.event[i].start)
        this.event[i].end = new Date(this.event[i].end)
       
        
        this.event[i].allDay =true;
       
      }
     
     
      this.events = this.event;
      console.log(this.events)
      this.events.sort(function(a,b) { 
        return new Date(a.start).getTime() - new Date(b.start).getTime() 
    });
     } )
  }
  if(this.role == 'project manager'){
    this.config.getSecondHttp('manager/events/'+this.shared.customerData.id,'').then((data:any)=>{
      console.log(data.data)
      this.event = data.data;
     
      for(var i = 0; i <this.event.length; i++)
      {
        this.event[i].start = new Date(this.event[i].start)
        this.event[i].end = new Date(this.event[i].end)
       
        
        this.event[i].allDay =true;
       
      }
     
     
      this.events = this.event;
      console.log(this.events)
      this.events.sort(function(a,b) { 
        return new Date(a.start).getTime() - new Date(b.start).getTime() 
    });
     } )
    
  }
  if(this.role == 'employee'){
    this.config.getSecondHttp('employee/events/'+this.shared.customerData.id,'').then((data:any)=>{
      console.log(data.data)
      this.event = data.data;
     
      for(var i = 0; i <this.event.length; i++)
      {
        this.event[i].start = new Date(this.event[i].start)
        this.event[i].end = new Date(this.event[i].end)
       
        
        this.event[i].allDay =true;
       
      }
     
     
      this.events = this.event;
      console.log(this.events)
      this.events.sort(function(a,b) { 
        return new Date(a.start).getTime() - new Date(b.start).getTime() 
    });
     } )
  }
  if(this.role == 'customer'){
    console.log('ye aya')
      this.config.getSecondHttp('customer/events/'+this.shared.customerData.id,'').then((data:any)=>{
        console.log(data.data)
        
        this.event = data.data;
       
        for(var i = 0; i <this.event.length; i++)
        {
          this.event[i].start = new Date(this.event[i].start)
          this.event[i].end = new Date(this.event[i].end)
         
          
          this.event[i].allDay =true;
         
        }
       
       
        this.events = this.event;
        console.log(this.events)
        this.events.sort(function(a,b) { 
          return new Date(a.start).getTime() - new Date(b.start).getTime() 
      });
       } )
  }
}
 
   

   handleEvent(action: string, event: CalendarEvent, content: any): void {
    this.select1 = false;
    this.select2 =false;
    this.select3 =false;
    this.select4 = false;
    this.select5 =false;
    this.clrr = event.color?.primary
    this.color = "#ff0000"
    this.subject.setValue(event.title);
    var starttime = event.start
    
   
    var start = this.toIsoString(starttime);
   
    start = start.replace(/:([0-9])([0-9]).05:00/, '');
    //  starttime = starttime.replace(/:00.000Z/,'');
    console.log(start)
    this.starttime.setValue(start)
   
    var endtime = event.end;
    
    var end = this.toIsoString(endtime);
    
    end = end.replace(/:([0-9])([0-9]).05:00/, '');
    console.log(end)
    this.endtime.setValue(end);
  
    this.modalData.action = action;
    this.modalData.event = event;

    this.eventtt = event;
    console.log(this.events)
    this.modalService.open(content, { size: 'lg' });
  }

  toIsoString(date: any) {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num: any) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
      };

    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
  }



deleteEvent() {
  this.config.deleteSecondHttp('manager/calenderevents/','').then((data:any)=>{
    window.location.reload();
    this.toast.success('Event Deleted Successfully!', 'Success')
  })

}

Cancel(){
  this.modalService.dismissAll()
}

Selectcolor(color:any,id:any){
  
 
}


  //Header functions
  
  logout(){
    this.shared.logOut();
  }


  changeLang(img:any,lang:any){}
}
