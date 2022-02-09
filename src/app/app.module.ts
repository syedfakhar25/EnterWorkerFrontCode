import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
//Animation//
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Md5 } from 'ts-md5';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NotFoundComponent } from './not-found/not-found.component';

//loader module
import { NgHttpLoaderModule } from 'ng-http-loader';
import { PusherService } from 'src/providers/pusher/pusher.service';
import { FeedComponent } from './feed/feed.component';

import {HashLocationStrategy,LocationStrategy} from '@angular/common';
import { FileSaverModule } from 'ngx-filesaver';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    FeedComponent,
    
   
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileSaverModule,
    ToastrModule.forRoot(),
    NgHttpLoaderModule.forRoot(),

    // CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [ConfigService,
    SharedDataService,ToasterService,Md5,PusherService,
    {provide:LocationStrategy,useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
