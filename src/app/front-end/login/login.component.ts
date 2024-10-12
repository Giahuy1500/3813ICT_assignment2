import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../service/authentication.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}
  handleSubmit() {
    this.authService.login(this.email, this.password).subscribe((data) => {
      if (data.status == 'ok') {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
