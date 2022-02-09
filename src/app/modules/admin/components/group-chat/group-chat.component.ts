import { Component, AfterViewChecked, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {


  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if(event.key == 'Enter'){
  //     this.SendMessage();
  //   }
  // }


  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;


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


  messages: any[] = [];
  newMessage = '';
  groupChats: any[] = [
    {
      id:1,
      groupchatname:"Carpenter's Work",

    },
    {
      id:2,
      groupchatname:"Carpenter's Work",
      
    },
    {
      id:3,
      groupchatname:"Carpenter's Work",
      
    },
    {
      id:4,
      groupchatname:"Carpenter's Work",
      
    },
    {
      id:5,
      groupchatname:"Carpenter's Work",
      
    },
    {
      id:6,
      groupchatname:"Carpenter's Work",
      
    },
    {
      id:7,
      groupchatname:"Carpenter's Work",
      
    },
    {
      id:8,
      groupchatname:"Carpenter's Work",
      
    }
  ];
  activeUser: boolean = false;
  typingTimer: boolean = false;
  chatWithUser = '';
  chatbox: boolean = false;

  messagesChannel: any;

  pusher: any;
  Echo: any

  UserDetails: any;

  groupchatname:any;

  data:any;

  constructor() { }

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
      // this.feedService.channel.bind('chat-event', (data:any)=> {
      
      //  this.messages.push(data.chat);
//        this.scrollToBottom();  
//        const theElement = document.getElementById('elementID');

//         const scrollToBottom = (node:any) => {
// 	     node.scrollTop = node.scrollHeight;
// }

// scrollToBottom(theElement);
//      });
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
}
