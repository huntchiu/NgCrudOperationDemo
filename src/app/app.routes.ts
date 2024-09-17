import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
  { path: 'list', component: EmployeeComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
