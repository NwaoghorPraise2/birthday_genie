import {JwtPayload} from 'jsonwebtoken';

export interface DecodedToken extends JwtPayload {
    id: string;
}

export interface IUser {
    id?: string;
    googleId?: string;
    username: string;
    email: string;
    dateOfBirth?: string;
    password: string;
    name?: string;
    description?: string;
    displayName?: string;
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

export interface GoogleUserData {
    email: string;
    name: string;
    picture: string;
    sub: string;
    given_name: string;
    family_name: string;
    email_verified: boolean;
}

