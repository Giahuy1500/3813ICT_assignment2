import { User } from './user.model';
import { Channel } from './channel.model';
export interface Group {
  channels: Channel[];
  name: string;
}
