import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerViewRoutingModule } from './customer-view-routing.module';
import { CustomerWelcomeComponent } from './customer-welcome/customer-welcome.component';
import { CustomerProjectOfferComponent } from './customer-project-offer/customer-project-offer.component';
import { CustomerProjectDrawingComponent } from './customer-project-drawing/customer-project-drawing.component';
import { CustomerProjectTimeLineComponent } from './customer-project-time-line/customer-project-time-line.component';
import { TopNavCustomerComponent } from './top-nav-customer/top-nav-customer.component';
import { CustomerProjectDetailsComponent } from './customer-project-details/customer-project-details.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { CarouselModule } from 'primeng/carousel';
import { AdminModule } from '../admin/admin.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [    
    CustomerWelcomeComponent,
    CustomerProjectOfferComponent,
    CustomerProjectDrawingComponent,
    CustomerProjectTimeLineComponent,
    TopNavCustomerComponent,
    CustomerProjectDetailsComponent
  ],
  imports: [
    CommonModule,    
    IvyCarouselModule,    
    CarouselModule,
    CustomerViewRoutingModule,
    AdminModule,
    FormsModule 
  ]
})
export class CustomerViewModule { }
