export class User {
  private id: string;
  private username: string;
  private email: string;
  private password: string;
  private groups: any[];
  private role: any[];
  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    groups: any[],
    role: any[]
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.groups = groups;
    this.role = role;
  }
}
