import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';

export const routes: Routes = [
  { path: 'employee-list', component: EmployeeComponent },
  { path: 'employee-edit/:id', component: EmployeeEditComponent },
  { path: '', redirectTo: 'employee-list', pathMatch: 'full' },
];
