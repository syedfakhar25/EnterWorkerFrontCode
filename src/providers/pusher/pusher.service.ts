import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  
  messagesChannel: any;

  pusher: any;

  constructor(private http: HttpClient) {
   
    
  }

  
 
}
