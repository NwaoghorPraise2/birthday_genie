import GlobalError from '../utils/HttpsErrors';
import asyncHandler from '../utils/asyncHandler';
import {Request, Response, NextFunction} from 'express';
import responseMessage from '../constant/responseMessage';
import {FriendService} from '../services/friendsService';
import {IFriend} from '../types/friends.types';
import httpResponse from '../dto/httpResponse';

export class FriendController {
    public static createFriend = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const friend = req.body as IFriend;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const createdfriend = await FriendService.doCreateFriend(friend, userId as string);
        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS, createdfriend);
    });

    public static createFriends = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const friends = req.body as IFriend[];
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const createdfriends = await FriendService.doCreateFriends(friends, userId as string);
        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS, createdfriends);
    });

    public static getFriends = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const friends = await FriendService.doGetFriends(userId as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, friends);
    });

    public static getFriend = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const friendId = req.params.id;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const friend = await FriendService.doGetFriend(friendId, userId as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, friend);
    });

    public static updateFriend = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const friendId = req.params.id;
        const friend = req.body as IFriend;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const updatedfriend = await FriendService.doUpdateFriend(friendId, friend, userId as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, updatedfriend);
    });
    ///RACTOR THIS DELETE OPERATION
    public static deleteFriend = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const friendId = req.params.id;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        await FriendService.doDeleteFriend(friendId, userId as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });
}

