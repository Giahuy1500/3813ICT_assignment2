import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../models/message.model';
const SERVER_URL = 'http://localhost:3030';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor() {}

  // Setup Connection to socket server
  initSocket() {
    this.socket = io(SERVER_URL);
    return () => {
      this.socket.disconnect();
    };
  }

  // Emit a message to the socket server
  send(message: Message) {
    this.socket.emit('message', message);
  }

  getMessage() {
    return new Observable<string>((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }
  public joinChannel(channelId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit('joinChannel', channelId, userId);
    }
  }

  // Listen for when a user joins a channel
  public userJoinedChannel(): Observable<{
    channelId: string;
    userId: string;
  }> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('userJoined', (data: any) => {
          observer.next(data);
        });
      }
    });
  }

  // Leave a specific channel
  public leaveChannel(channelId: string, userId: string): void {
    if (this.socket) {
      this.socket.emit('leaveChannel', channelId, userId);
    }
  }

  // Listen for when a user leaves a channel
  public userLeftChannel(): Observable<{ channelId: string; userId: string }> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('userLeft', (data: any) => {
          observer.next(data);
        });
      }
    });
  }
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
