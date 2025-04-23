// this interface is used for login using email and password
export interface BaseUser {
  email: string;
  password: string;
}

// this interface is used for registering new user with name, email, password
export interface NewUser extends BaseUser {
  name: string;
}

// this interface is used for user returned from database
export interface User extends NewUser {
  readonly id: number;
  created_at: Date;
}
