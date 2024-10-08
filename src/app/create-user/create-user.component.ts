import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  username: any;
  password: any;
  email: any;
  role: any;
}
