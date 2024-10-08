import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:3030/api';
  constructor(private http: HttpClient) {}
  login(user: User) {
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }
}
