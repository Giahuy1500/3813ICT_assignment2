import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from '../models/group.model';
import { Channel } from '../models/channel.model';
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
  createChannel(groupId: string, channel: Channel) {
    return this.http.post<any>(`${this.baseUrl}/create-channel`, {
      groupId: groupId,
      channel: channel,
    });
  }
  removeUserToGroup(group: any, username: string) {
    return this.http.post<any>(`${this.baseUrl}/remove-user-from-group`, {
      group: group,
      username: username,
    });
  }
  loadGroupByEmail(email: string) {
    return this.http.post<any>(`${this.baseUrl}/load-groups-by-user-email`, {
      email: email,
    });
  }
  loadChannelsFromGroup(email: string, groupId: any) {
    return this.http.post<any>(`${this.baseUrl}/load-channels-from-group`, {
      email,
      groupId,
    });
  }
  addUserToGroup(group: any, username: string) {
    const body = { group, username };
    return this.http.post<any>(`${this.baseUrl}/add-user-to-group`, body);
  }

  deleteChannel(groupId: string, channelName: string) {
    const body = {
      groupId: groupId,
      channelName: channelName,
    };

    return this.http.post(`${this.baseUrl}/delete-channel`, body);
  }
}
