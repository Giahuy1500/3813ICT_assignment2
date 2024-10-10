import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';
import { UserManagementService } from '../service/user-management.service';
import { group } from '@angular/animations';
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  role: string = '';
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private userManagement: UserManagementService) {}
  createUser() {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (!this.username || !this.password || !this.email || !this.role) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    let user: User = {
      username: this.username,
      password: this.password,
      email: this.email,
      role: this.role,
      groups: [],
    };
    this.userManagement.createUser(user).subscribe({
      next: (data) => {
        this.successMessage = 'User created successfully!';
        this.isLoading = false; // Stop loading
        this.resetForm(); // Reset the form after successful submission
      },
      error: (err) => {
        this.errorMessage = 'Error creating user ';
        this.isLoading = false; // Stop loading on error
      },
    });
  }
  resetForm() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.role = '';
    this.isSubmitted = false;
  }
}
