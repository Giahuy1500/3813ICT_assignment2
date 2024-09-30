export class User {
  private id: string;
  private username: string;
  private email: string;
  private password: string;
  private profilePicture?: string;
  private status?: string;

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    profilePicture?: string,
    status?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
    this.status = status;
  }
}
