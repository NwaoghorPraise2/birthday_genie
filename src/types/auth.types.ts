export interface IUser {
    id?: string;
    username: string;
    email: string;
    password: string;
    name?: string;
    phoneNumber?: string;
    profilePic?: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}