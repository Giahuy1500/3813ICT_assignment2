import { Message } from './message.model';
export interface Channel {
  name: string;
  messages: Message[];
}
