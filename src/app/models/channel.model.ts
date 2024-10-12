import { User } from './user.model';
export interface Channel {
  users: User[];
  name: string;
}
