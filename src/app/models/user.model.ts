export class User {
  private id: string;
  private username: string;
  private email: string;
  private password: string;

  constructor(id: string, username: string, email: string, password: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
