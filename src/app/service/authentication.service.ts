import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:3030/api';
  constructor(private http: HttpClient) {}
  login(email: string, password: string) {
    const user = { email, password };
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }
  loadUser() {
    return this.http.get<any>(`${this.baseUrl}/load-users`);
  }
}
