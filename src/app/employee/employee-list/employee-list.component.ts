import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ModalModule],
  providers: [],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  employeeForm!: FormGroup;
  employeeList!: Employee[];

  constructor(
    private employeeService: EmployeeService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.refreshEmployeeList();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      hire_date: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      is_active: [true],
    });
  }

  loadEmployees(): Observable<Employee[]> {
    return this.employeeService.getEmployees().pipe(
      catchError((err) => {
        console.error('Error loading employees:', err);
        return of([]); // 返回空数组，避免错误中断
      })
    );
  }

  refreshEmployeeList(): void {
    this.loadEmployees().subscribe((employees) => {
      this.employeeList = employees;
    });
  }

  openModal(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template);
  }

  validateForm(): boolean {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  hideModalAndResetForm(): void {
    this.modalRef?.hide();
    this.modalRef = undefined;
    this.employeeForm.reset({ is_active: true });
  }


  submitEmployee(employee: Employee): void {
    this.employeeService.createEmployee(employee).subscribe({
      next: () => {
        this.hideModalAndResetForm();
        this.refreshEmployeeList();
      },
      error: (err) => {
        console.error('Error creating employee:', err);
      },
    });
  }

  createEmployee(): void {
    if (!this.validateForm()) {
      return;
    }

    const newEmployee: Employee = this.employeeForm.value;
    this.submitEmployee(newEmployee);
  }

  removeEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.refreshEmployeeList();
      },
      error: (err) => {
        console.error('Error removing employee:', err);
      },
    });
  }
}
