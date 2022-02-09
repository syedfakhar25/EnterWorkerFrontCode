import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerProjectDetailsComponent } from './customer-project-details/customer-project-details.component';
import { CustomerProjectDrawingComponent } from './customer-project-drawing/customer-project-drawing.component';
import { CustomerProjectOfferComponent } from './customer-project-offer/customer-project-offer.component';
import { CustomerProjectTimeLineComponent } from './customer-project-time-line/customer-project-time-line.component';
import { CustomerWelcomeComponent } from './customer-welcome/customer-welcome.component';
import { TopNavCustomerComponent } from './top-nav-customer/top-nav-customer.component';

const routes: Routes = [
  {
    path: '', component: TopNavCustomerComponent,
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: CustomerWelcomeComponent },
      { path: 'project-offer', component: CustomerProjectOfferComponent },
      { path: 'project-drawing', component: CustomerProjectDrawingComponent },
      { path: 'project-timeline', component: CustomerProjectTimeLineComponent },
      { path: 'customer-project-details', component: CustomerProjectDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerViewRoutingModule { }
