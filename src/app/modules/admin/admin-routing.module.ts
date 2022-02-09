import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { AddDesignationComponent } from './components/add-designation/add-designation.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { AddManagerComponent } from './components/add-manager/add-manager.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { AddWorkerComponent } from './components/add-worker/add-worker.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ChatComponent } from './components/chat/chat.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DesignationsComponent } from './components/designations/designations.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { EditManagerComponent } from './components/edit-manager/edit-manager.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { EditWorkerComponent } from './components/edit-worker/edit-worker.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { EmployeesComponent } from './components/employees/employees.component';

import { HomeComponent } from './components/home/home.component';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { ManagersComponent } from './components/managers/managers.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { WorkerProfileComponent } from './components/worker-profile/worker-profile.component';
import { WorkersComponent } from './components/workers/workers.component';

const routes: Routes = [

  {path:'',component:MainContainerComponent,
  children:[
    {path:'',component:HomeComponent},
    {path:'home',component:HomeComponent},
    {path:'employees',component:EmployeesComponent},
    {path:'add-employee',component:AddEmployeeComponent},
    {path:'add-manager',component:AddManagerComponent},
    {path:'add-designation',component:AddDesignationComponent},
    {path:'designations',component:DesignationsComponent},
    {path:'edit-employee',component:EditEmployeeComponent},
    {path:'edit-manager',component:EditManagerComponent},
    {path:'employee-profile',component:EmployeeProfileComponent},
    {path:'projects',component:ProjectsComponent},
    {path:'project-details',component:ProjectDetailsComponent},
    {path:'add-project',component:AddProjectComponent},
    {path:'edit-project',component:EditProjectComponent},
    {path:'customers',component:CustomersComponent},
    {path:'add-customer',component:AddCustomerComponent},
    {path:'edit-customer',component:EditCustomerComponent},
    {path:'customer-profile',component:CustomerProfileComponent},
    {path:'chat',component:ChatComponent},
    {path:'calendar',component:CalendarComponent},
    {path:'edit-profile',component:EditProfileComponent},
    {path:'tasks',component:TasksComponent},
    {path:'managers',component:ManagersComponent},
  
    {path:'workers',component:WorkersComponent},
    {path:'add-worker',component:AddWorkerComponent},
    {path:'edit-worker',component:EditWorkerComponent},
    {path:'worker-profile',component:WorkerProfileComponent},
    {path:':id/:id/under-construction',component:UnderConstructionComponent}
]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
