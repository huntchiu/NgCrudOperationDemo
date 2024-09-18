import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { Employee } from '../employee.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [EmployeeService],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css',
})
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: string;
  employee!: Employee;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    console.log(employeeId);

    if (employeeId) {
      this.employeeId = employeeId;
      this.fetchEmployeeById(employeeId);
    }

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      hire_date: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      is_active: [true],
    });
  }

  fetchEmployeeById(id: string): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.employeeForm.patchValue(employee);
      },
      error: (err) => {},
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    if (this.employeeForm.valid) {
      const newEmployee: Employee = this.employeeForm.value;
      newEmployee.id = this.employeeId;
      debugger;
      this.employeeService.updateEmployee(newEmployee).subscribe({
        next: (employee) => {
          this.employeeForm.reset();
          this.router.navigate(['/employee-list']);
        },
        error: (err) => {},
      });
    }
  }
}
