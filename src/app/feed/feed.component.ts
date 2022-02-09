import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedService } from '../feed.service';
import { Feed } from '../feed';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [FeedService],
})
export class FeedComponent implements OnInit, OnDestroy {
  public feeds: Feed[] = [];

 
  constructor(private feedService: FeedService) {
    
  }

  ngOnInit() {}

  ngOnDestroy() {
    
  }
}
