import { User } from './user.model';
export interface Group {
  channels: any[];
  name: string;
  users: User[];
}
