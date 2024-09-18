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

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    ReactiveFormsModule, // 导入 ReactiveFormsModule
    CommonModule,
    RouterModule,
  ],
  providers: [BsModalService, EmployeeService],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  employeeForm!: FormGroup;
  employees!: Employee[];

  constructor(
    private employeeService: EmployeeService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      hire_date: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      is_active: [true],
    });

    this.fetchEmployees();
  }
  fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (err) => {},
    });
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      // 标记所有控件为脏，以便显示验证信息
      this.employeeForm.markAllAsTouched();
      return;
    }

    if (this.employeeForm.valid) {
      const newEmployee: Employee = this.employeeForm.value;
      this.employeeService.createEmployee(newEmployee).subscribe({
        next: (employee) => {
          this.modalRef?.hide();
          this.fetchEmployees();
          // 清空表单的值
          this.employeeForm.reset();
        },
        error: (err) => {},
      });
    }
  }

  onDelete(id:string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (employee) => {
        this.fetchEmployees();
      },
      error: (err) => {},
    });
  }
}
