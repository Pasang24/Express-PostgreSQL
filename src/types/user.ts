// this interface is used for login using email and password
export interface IBaseUser {
  email: string;
  password: string;
}

// this interface is used for registering new user with name, email, password
export interface INewUser extends IBaseUser {
  name: string;
}

// this interface is used for user returned from database
export interface IUser extends INewUser {
  readonly id: number;
  created_at: Date;
}
