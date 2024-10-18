export interface IUser {
    id?: string;
    username: string;
    email: string;
    password: string;
    name?: string;
    phoneNumber?: string;
    profilePic?: string;
    isVerified?: boolean;
    isBlocked?: boolean;
    refreshToken?: string;
    resetPasswordToken?: string;
	resetPasswordTokenExpiresAt?: Date;
    verificationToken?: string;
	verificationTokenExpiresAt?: Date;
}

export interface IUserLogin {
    email: string;
    password: string;
}