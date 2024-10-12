import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import { GroupService } from '../../service/group.service';
import { group } from '@angular/animations';
@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent {
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  groups: Group[] = [];
  users: User[] = [];
  selectedGroupForChannel: any;
  selectedGroup: any;
  newGroupName: string = '';
  newChannelName: string = '';
  selectedUserId: string = '';
  isModalVisible: boolean = false; // Controls modal visibility

  constructor(private groupService: GroupService) {}

  ngOnInit() {
    this.loadGroups();
    this.loadUsers();
  }
  loadGroups() {
    this.groupService.loadGroup().subscribe((data: any) => {
      this.groups = data.groups;
    });
  }
  loadUsers() {}
  createGroup() {
    let group: Group = { name: this.newGroupName, users: [], channels: [] };
    this.groupService.createGroup(group).subscribe((data) => {
      this.groups.push(data.group);
    });
  }
  openDeleteModal(group: any) {
    this.selectedGroup = group;
    this.isModalVisible = true; // Show the modal
  }
  closeModal() {
    this.isModalVisible = false; // Hide the modal
  }
  addChannel(channelID: any) {}
  addUserToGroup(groupId: any) {}
  removeUserFromGroup(groupId: any, user: any) {}
  removeUserFromChannel(groupId: any, channelID: any, user: any) {}
  deleteGroup(group: any) {
    this.groupService.deleteGroup(group).subscribe((data) => {
      this.groups = this.groups.filter((g) => g !== group);
      console.log('Group deleted:', group);
    });
    this.isModalVisible = false;
  }
  removeChannel(groupId: any, channelID: any) {}
  addUserToChannel() {}
}
