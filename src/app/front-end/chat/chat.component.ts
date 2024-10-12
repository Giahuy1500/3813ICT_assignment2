import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message.model';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../service/socket.service';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>; // Reference to the local video element
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>; // Reference to the remote video element
  messages: Message[] = [];
  ioConnection: any;
  messageInput: string = '';
  currentUser: string = '';
  selectedFile: File | null = null;
  isVideoChatActive: boolean = false;
  isMeetingActive: boolean = false;
  localStream: MediaStream | null = null;
  remoteStream: MediaStream | null = null;
  peerConnection: RTCPeerConnection | null = null;

  constructor(private http: HttpClient, private socket: SocketService) {}

  ngOnInit() {
    this.loadMessages(); // Load chat history on init
    this.initIoConnection();
    const userData = localStorage.getItem('userData');

    if (userData) {
      this.currentUser = userData;
    }
  }
  initIoConnection() {
    this.socket.initSocket();
    this.ioConnection = this.socket.getMessage().subscribe((message: any) => {
      // add new message to the messages array.
      this.messages.push(message);
    });
  }

  startMeeting() {
    this.isMeetingActive = true;
  }

  stopVideoChat(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }
    this.isVideoChatActive = false;
  }

  async startVideoChat() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localVideo.nativeElement.srcObject = this.localStream; // Attach the local stream to the video element
      this.peerConnection = new RTCPeerConnection();

      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
        this.remoteVideo.nativeElement.srcObject = this.remoteStream; // Attach the remote stream to the video element
      };

      if (this.peerConnection && this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream as MediaStream);
        });
      }

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      console.log(offer);
      this.isVideoChatActive = true;
    } catch (error) {
      console.error('Error starting video chat:', error);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  stopMeeting() {
    this.isMeetingActive = false;
  }

  saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
  }

  loadMessages(): void {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }
  }

  sendMessage() {
    if (this.messageInput.trim() || this.selectedFile) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('chatImage', this.selectedFile);

        this.http
          .post<{ filePath: string }>(
            'http://localhost:3030/upload/chat',
            formData
          )
          .subscribe(
            (response) => {
              const newMessage = {
                user: this.currentUser,
                imageUrl: `http://localhost:3030/${response.filePath}`, // Ensure the URL is correct
                timestamp: new Date(),
              };
              this.messages.push(newMessage);
              this.saveMessages();
              this.selectedFile = null;
            },
            (error) => {
              console.error('Error uploading file:', error);
            }
          );
      } else {
        const newMessage = {
          user: this.currentUser,
          text: this.messageInput,
          timestamp: new Date(),
        };
        this.socket.send(newMessage);

        this.saveMessages();
      }
      this.messageInput = '';
    }
  }
}
