import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from '../models/group.model';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private baseUrl = 'http://localhost:3030/api';

  constructor(private http: HttpClient) {}
  createGroup(group: Group) {
    console.log(group);
    return this.http.post<any>(`${this.baseUrl}/create-group`, group);
  }
  loadGroup() {
    return this.http.get<any>(`${this.baseUrl}/load-groups`);
  }
  deleteGroup(group: Group) {
    return this.http.post<any>(`${this.baseUrl}/delete-group`, group);
  }
}
