import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  role: any;
  isNavbarCollapsed = true; // Default to collapsed

  username: any;
  constructor(private router: Router) {}
  logout() {
    this.router.navigateByUrl('/');
  }
}
