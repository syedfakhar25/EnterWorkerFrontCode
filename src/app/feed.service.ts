import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Feed } from './feed';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private subject: Subject<Feed> = new Subject<Feed>();

  private pusherClient: Pusher;
   public channel:any
  constructor() {
    // this.pusherClient = new Pusher('e621e8f245a33f2a1ffc', { cluster: 'ap2' });

    // const channel = this.pusherClient.subscribe('realtime-feeds');

    // channel.bind(
    //   'posts',
    //   (data: { title: string; body: string; time: string }) => {
    //     this.subject.next(new Feed(data.title, data.body, new Date(data.time)));
    //   }
    // );
    console.log('ye aya')
    this.pusherClient = new Pusher('e621e8f245a33f2a1ffc', {
      cluster: 'ap2'
    });

    this.channel = this.pusherClient.subscribe('kuchbi-development');
    console.log(this.channel)
    
  }

  
}
