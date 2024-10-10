import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private baseUrl = 'http://localhost:3030/api';
  constructor(private http: HttpClient) {}
  createUser(user: User) {
    return this.http.post<any>(`${this.baseUrl}/create-user`, user);
  }
}
