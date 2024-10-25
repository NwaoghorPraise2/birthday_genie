import {Request, Response} from 'express';

// const oauthClient = AuthService.JWTService.getOAuthClient();
// const {tokens} = await oauthClient.getToken(code);
// const access_token = tokens.access_token;
// const userData = await this.getOAuthUserData(access_token);
// if (!userData) throw new GlobalError(500, responseMessage.SOMETHING_WENT_WRONG);
// const User: IUser = await AuthRepository.getUserByEmail(userData.email);
// if (!User) {
//     const {verificationToken, verificationTokenExpiresAt} = generateTokens;
//     const result = (await AuthRepository.createUser({
//         email: userData.email,
//         username: userData.name,
//         password: userData.sub,
//         verificationToken,
//         verificationTokenExpiresAt
//     })) as IUser;
//     const payload = {id: result.id as string};
//     const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);
//     emailEmitter.emit('Verification-Email', {
//         email: result?.email,
//         name: result?.username,
//         verificationToken: result?.verificationToken
//     });
//     return {access_token, refresh_token, result};
// } else {
//     const payload = {id: User.id as string};
//     const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);
//     return {access_token, refresh_token, result: User};
// }

