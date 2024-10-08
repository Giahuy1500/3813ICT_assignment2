export class Message {
  id: number;
  senderId: number;
  content: string;
  grpId: number;
  time: Date;

  constructor(
    id: number,
    senderId: number,
    content: string,
    time: Date,
    grpId: number
  ) {
    this.id = id;
    this.grpId = grpId;
    this.senderId = senderId;
    this.content = content;
    this.time = time;
  }
}
