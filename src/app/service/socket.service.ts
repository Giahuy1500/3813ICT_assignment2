import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
const SERVER_URL = 'http://localhost:3030';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor() {}

  initSocket() {
    this.socket = io(SERVER_URL);
    return () => {
      this.socket.disconnect();
    };
  }
  send(message: string) {
    this.socket.emit('message', message);
  }
  getMessage() {
    return new Observable<string>((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }
}
