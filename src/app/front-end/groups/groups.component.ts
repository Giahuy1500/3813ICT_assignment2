import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import { GroupService } from '../../service/group.service';
import { AuthenticationService } from '../../service/authentication.service';
@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent {
  groups: Group[] = [];
  users: User[] = [];
  selectedChannel: any;
  selectedGroup: any;
  newGroupName: string = '';
  newChannelName: string = '';
  newUserName: string = '';
  selectedUserId: string = '';
  //variable for modal
  showDeleteGroupModal: boolean = false;
  showCreateChannelModal: boolean = false;
  showAddUserToGroupModal: boolean = false;
  showDeleteUserFromGroupModal: boolean = false;
  constructor(
    private groupService: GroupService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loadGroups();
    this.loadUsers();
  }
  loadGroups() {
    this.groupService.loadGroup().subscribe((data: any) => {
      this.groups = data.groups;
    });
  }
  loadUsers() {
    this.authService.loadUser().subscribe((data) => {
      this.users = data.users;
    });
  }
  createGroup() {
    let group: Group = { name: this.newGroupName, channels: [] };
    this.groupService.createGroup(group).subscribe((data) => {
      this.groups.push(data.group);
    });
  }
  openDeleteUserFromGroup(group: any) {
    this.selectedGroup = group;
    this.showDeleteUserFromGroupModal = true;
  }
  openCreateChannelModal(group: any) {
    this.selectedGroup = group;
    this.showCreateChannelModal = true;
  }
  openDeleteGroupModal(group: any) {
    this.selectedGroup = group;
    this.showDeleteGroupModal = true; // Show the modal
  }
  openAddUserToGroupModal(group: any) {
    this.selectedGroup = group;
    this.showAddUserToGroupModal = true;
  }

  closeModal() {
    this.showDeleteGroupModal = false; // Hide the modal
    this.showAddUserToGroupModal = false;
    this.showCreateChannelModal = false;
    this.showDeleteUserFromGroupModal = false;
  }

  addUserToGroup() {
    this.groupService
      .addUserToGroup(this.selectedGroup, this.newUserName)
      .subscribe((data) => {
        console.log(data);
        this.showAddUserToGroupModal = false;
      });
  }
  removeUserFromGroup() {
    console.log(this.selectedGroup, this.newUserName);
    this.groupService
      .removeUserToGroup(this.selectedGroup, this.newUserName)
      .subscribe((data) => {
        console.log(data);
        this.showDeleteUserFromGroupModal = false;
      });
  }
  deleteGroup(group: any) {
    this.groupService.deleteGroup(group).subscribe((data) => {
      this.groups = this.groups.filter((g) => g !== group);
      console.log('Group deleted:', group);
    });
    this.showDeleteGroupModal = false;
  }
  deleteChannel(group: any, channel: any) {
    this.groupService
      .deleteChannel(group._id, channel.name)
      .subscribe((data) => {
        group.channels = group.channels.filter(
          (c: any) => c.name !== channel.name
        );
      });
  }
  createChannel() {
    let channel: Channel = {
      name: this.newChannelName,
      messages: [],
    };
    this.groupService
      .createChannel(this.selectedGroup._id, channel)
      .subscribe((data) => {
        this.selectedGroup.channels.push(channel);
        this.newChannelName = '';
        this.showCreateChannelModal = false;
      });
  }
}
