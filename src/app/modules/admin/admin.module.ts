import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { HomeComponent } from './components/home/home.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule,NgbProgressbarModule,NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesComponent } from './components/employees/employees.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersComponent } from './components/customers/customers.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

import { MatCheckboxModule} from '@angular/material/checkbox';
import { TasksComponent } from './components/tasks/tasks.component';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
import { ToastrModule } from 'ngx-toastr';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EditProjectComponent } from './components/edit-project/edit-project.component';

//loader module
import { NgHttpLoaderModule } from 'ng-http-loader';
import { PusherService } from 'src/providers/pusher/pusher.service';
import { MomentModule } from 'ngx-moment';

//Slider Carrousel//
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { ManagersComponent } from './components/managers/managers.component';


import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import { DesignationsComponent } from './components/designations/designations.component';
import { AddDesignationComponent } from './components/add-designation/add-designation.component';


import { FileSaverModule } from 'ngx-filesaver';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';


//Pdf Viewer
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SafePipe } from './safe.pipe';
import { WorkersComponent } from './components/workers/workers.component';
import { AddWorkerComponent } from './components/add-worker/add-worker.component';
import { EditWorkerComponent } from './components/edit-worker/edit-worker.component';
import { WorkerProfileComponent } from './components/worker-profile/worker-profile.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { AddManagerComponent } from './components/add-manager/add-manager.component';
import { EditManagerComponent } from './components/edit-manager/edit-manager.component';

@NgModule({
  declarations: [
    MainContainerComponent,
    HomeComponent,
    EmployeesComponent,
    ProjectsComponent,
    AddEmployeeComponent,
    AddProjectComponent,
    CustomersComponent,
    AddCustomerComponent,
    ProjectDetailsComponent,
    EmployeeProfileComponent,
    CustomerProfileComponent,
    ChatComponent,
    CalendarComponent,
    EditProfileComponent,
    TasksComponent,
    EditCustomerComponent,
    EditEmployeeComponent,
    EditProjectComponent,
    ManagersComponent,
    DesignationsComponent,
    AddDesignationComponent,
    SidebarComponent,
    HeaderComponent,
    SafePipe,
    WorkersComponent,
    AddWorkerComponent,
    EditWorkerComponent,
    WorkerProfileComponent,
    UnderConstructionComponent,
    AddManagerComponent,
    EditManagerComponent,
   
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    ChartsModule,
    NgbModule,
    NgbProgressbarModule,
    FormsModule,
    NgbDropdownModule,
    HttpClientModule,
    MatCheckboxModule,
    FileSaverModule,
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    Ng2SearchPipeModule,
    NgHttpLoaderModule.forRoot(),
    MomentModule,
    IvyCarouselModule,

    
    CarouselModule,
    ButtonModule,
    ToastModule,
    PdfViewerModule

    
  
  ],
  exports: [SafePipe],
  providers:[
    HttpClient,
    ConfigService,
    ToasterService,
    PusherService
  ],

})
export class AdminModule { }
