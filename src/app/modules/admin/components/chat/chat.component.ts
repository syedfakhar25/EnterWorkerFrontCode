import { Component, AfterViewChecked, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PusherService } from 'src/providers/pusher/pusher.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { environment } from '../../../../../environments/environment';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { FeedService } from '../../../../feed.service';
import { Feed } from '../../../../feed';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked  {
  public feeds: Feed[] = [];


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == 'Enter'){
      this.SendMessage();
    }
  }
  
//

@ViewChild('scrollMe') private myScrollContainer!: ElementRef;

//
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


  //Chat Module Variables
  messages: any[] = [];
  newMessage = '';
  users: any[] = [];
  activeUser: boolean = false;
  typingTimer: boolean = false;
  chatWithUser = '';
  chatbox: boolean = false;
  chatbox2 : boolean = false;

  messagesChannel: any;

  pusher: any;
  Echo: any

  UserDetails: any;

  user:any;

  data:any;

  //fileUpload variables
  
  @ViewChild("fileInput", { static: true }) uploader:any;

  imageFilePath:any;

  filename:any;
  //fileUpload variables

 

  groupChats:any[]= [
    {
      id:1,
      groupname:"Carpenter's Work"
    },
    {
      id:2,
      groupname:"Plumber's Work"
    },
    {
      id:3,
      groupname:"Bathroom's Work"
    },
    {
      id:4,
      groupname:"Drawing room's Work"
    },
    {
      id:5,
      groupname:"TV loundge's Work"
    }
  ];


  dummygroupMsgs:any[]=[
    {
      user:{
        id:4,
        first_name:'Haider',
        last_name:'Ali',

      },
      message:'Hello , how are you?',
      created_at:'2021-10-14T04:26:45.000000Z'
    },
    {
      user:{
        id:2,
        first_name:'Lisa',
        last_name:'John',

      },
      message:'I am good',
      created_at:'2021-10-14T04:26:45.000000Z'
    },
    {
      user:{
        id:this.shared.customerData.id,
        first_name:this.shared.customerData.first_name,
        last_name:this.shared.customerData.last_name,

      },
      message:"What's the update?",
      created_at:'2021-10-14T04:26:45.000000Z'
    },
    {
      user:{
        id:3,
        first_name:'Jack',
        last_name:'William',

      },
      message:'Hey guys!',
      created_at:'2021-10-14T04:26:45.000000Z'
    },

  ]


  AllEmployees:any[]=[]
  selectedEmployee:any;

  role:any;
  constructor(private modalService: NgbModal,
    public toast: ToasterService,
    public route:ActivatedRoute,
    public router:Router,
    public shared: SharedDataService, public config: ConfigService, private http: HttpClient, private feedService: FeedService) {
  
    this.getUsersLists();
    this.getAllEmployees()


    this.role =this.shared.role;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.UserDetails = this.router.getCurrentNavigation()?.extras.state?.user;
        this.chatbox =true;
        this.FetchMessages();
        localStorage.removeItem('ChatObject');
      localStorage.setItem('ChatObject', JSON.stringify(this.UserDetails));
       
       
        
      }
      
      
    });
    
    this.UserDetails = JSON.parse(localStorage.getItem('ChatObject')||'{}');
    console.log(Object.keys(this.UserDetails).length)
   if(Object.keys(this.UserDetails).length !=0){
    this.chatbox =true;
    this.FetchMessages();
   }
   
    
  }
  ngAfterViewChecked(){
  //  this.scrollToBottom();      
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


      }
      )
      this.feedService.channel.bind('chat-event', (data:any)=> {
      
       this.messages.push(data.chat);
       this.scrollToBottom();  
       const theElement = document.getElementById('elementID');

        const scrollToBottom = (node:any) => {
	     node.scrollTop = node.scrollHeight;
}

scrollToBottom(theElement);
     });
  }

 

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  getUsersLists() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.shared.token}`
    });

    this.config.getSecondHttp('auth/users-list', { headers }).then((data: any) => {
      this.users = data.data;
     
      let usrs: any[] = [];
      for (let i = 0; i < this.users.length; i++) {

        if (this.users[i].id != this.shared.customerData.id) {
          usrs.push(this.users[i])
        }
      }
      this.users = usrs;
      console.log(this.users);
    })
  }

  FetchMessages() {

    console.log(this.UserDetails.id)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.shared.token}`
    });
    if (this.UserDetails != null || this.UserDetails != undefined) {
      this.http.post('http://entreworker.a2itronic.ma/api/auth/fetch-messages', {
        'chatwith_id': this.UserDetails.id,
        'user_id': this.shared.customerData.id
      }, { headers }).subscribe((data: any) => {
        console.log(data);
        this.messages = data;
      })
    }

  }

  SendMessage() {
    if(this.newMessage ==''){
      this.toast.error('Message cannot be empty!');
      return;
    }
    let message = {
      chatwith_id: this.UserDetails.id,
      message: this.newMessage,
    }
    // this.messagesChannel.trigger('ChatEvent', message);
    // this.messages.push(message);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.shared.token}`
    });

    this.http.post('http://entreworker.a2itronic.ma/api/auth/messages', {
      'chatwith_id': this.UserDetails.id,
      'message': this.newMessage
    }, { headers }).subscribe((data: any) => {
      
      this.newMessage = '';
    })
  }

  chatWithuser(a: any) {
    //     this.pusher = new Pusher('e621e8f245a33f2a1ffc',{
    //       cluster: 'ap2'

    //     }
    //  );

    // console.log(this.pusher); 
    //  this.messagesChannel = this.pusher.subscribe('kuchbi');

    //  this.messagesChannel.bind('ChatEvent', (message:any) => {
    //   this.messages.push(message);
    //  }
    //   )

    this.filename = undefined

    console.log(a)
    this.UserDetails = a;
    localStorage.removeItem('ChatObject');
    localStorage.setItem('ChatObject', JSON.stringify(this.UserDetails));
    this.chatbox = true;
    this.chatbox2 =false;
    this.FetchMessages()
  }


  addNewgroup(content: any){
    const element = <HTMLElement>document.getElementsByClassName('content-wrapper')[0];
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

  getGroupChats(){

  }

  openGroupChat(a:any){
    this.filename = undefined
    this.chatbox = false;
    this.chatbox2 = true;
    this.UserDetails = a;
  }


  getAllEmployees() {
    this.config.getSecondHttp('all-employee', '').then((data: any) => {

      this.AllEmployees = data.data

    })
  }

  SelectEmployee(event:any){

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


  cancel() {
    const element = <HTMLElement>document.getElementsByClassName('content-wrapper')[0];
    element.style.filter = 'none';
    this.modalService.dismissAll();

  }


  //file uploader



  async onFileChange(event:any) {


   this.filename = event.target.files[0].name
    var filename = event.target.files[0].name
    console.log("File Name")
    console.log(filename)
    var fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0])
    fileReader.onload = () => {
      console.log(fileReader.result)

   
     // here this method will return base64 string :D 
  }


 

}

RemoveAttachment(){
  this.filename =undefined;
}

  //Header functions
  
  logout(){
    this.shared.logOut();
  }


  changeLang(img:any,lang:any){}
}

