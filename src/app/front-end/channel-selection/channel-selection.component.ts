import { Component } from '@angular/core';
import { Group } from '../../models/group.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../models/channel.model';
import { Subscription } from 'rxjs';
import { GroupService } from '../../service/group.service';
import { SocketService } from '../../service/socket.service';
@Component({
  selector: 'app-channel-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-selection.component.html',
  styleUrl: './channel-selection.component.css',
})
export class ChannelSelectionComponent {
  private subscriptions: Subscription[] = [];
  selectedGroup: string = '';
  selectedChannels: Channel[] = [];
  useremail: any;
  // Groups and their respective channels
  groups: Group[] = [];
  channels: Channel[] = [];
  currentUserId: string = 'user1'; // Replace with dynamic user ID
  currentChannelId: string = 'channel1'; // Replace with dynamic channel ID
  constructor(
    private groupService: GroupService,
    private socket: SocketService
  ) {}
  ngOnInit() {
    this.socket.initSocket();
    const joinSub = this.socket.userJoinedChannel().subscribe((data) => {
      console.log(`User joined channel ${data.channelId}`);
    });
    this.subscriptions.push(joinSub);

    const leaveSub = this.socket.userLeftChannel().subscribe((data) => {
      console.log(`User ${data.userId} left channel ${data.channelId}`);
    });
    this.subscriptions.push(leaveSub);

    this.loadGroup();
  }

  ngOnDestroy(): void {
    // Leave the channel when component is destroyed
    this.socket.leaveChannel(this.currentChannelId, this.currentUserId);

    // Unsubscribe from all observables to avoid memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    // Disconnect the socket
    this.socket.disconnect();
  }
  loadGroup() {
    this.useremail = localStorage.getItem('userData'); // Get the email from localStorage
    console.log(this.useremail);
    if (this.useremail) {
      this.useremail = this.useremail.replace(/['"]+/g, '').trim();
      this.groupService.loadGroupByEmail(this.useremail).subscribe((data) => {
        this.groups = data.groups;
      });
    } else {
      console.error('User email not found in localStorage');
    }
  }

  // Handle group change and update channels
  onGroupChange(selectedGroup: any) {
    console.log('Selected Group:', selectedGroup);

    if (selectedGroup && selectedGroup._id) {
      console.log('Selected Group ID:', selectedGroup._id); // This will log the ID only
    } else {
      console.log('Selected group does not have an ID');
    }

    this.groupService
      .loadChannelsFromGroup(this.useremail, selectedGroup._id)
      .subscribe((data) => {
        console.log(data);
        this.channels = data.channels;
      });
  }

  // Handle form submission
  joinChannel() {
    if (this.selectedGroup && this.selectedChannels.length > 0) {
      this.selectedChannels.forEach((channel) => {
        this.socket.joinChannel(channel.name, this.selectedGroup);
      });
    } else {
      console.error('Please select a group and channels to join.');
    }
  }
  leaveChannel() {
    if (this.selectedGroup && this.selectedChannels.length > 0) {
      this.selectedChannels.forEach((channel) => {
        this.socket.leaveChannel(channel.name, this.selectedGroup);
      });
    } else {
      console.error('Please select a group and channels to leave.');
    }
  }
}
