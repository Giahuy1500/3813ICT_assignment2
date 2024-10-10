export class User {
  // public fields instead of private
  public username: string;
  public email: string;
  public password: string;
  public groups: any[];
  public role: any;

  constructor(
    username: string = '',
    email: string = '',
    password: string = '',
    groups: any[] = [],
    role: any = null
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.groups = groups;
    this.role = role;
  }
}
