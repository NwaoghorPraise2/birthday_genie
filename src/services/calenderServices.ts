import CalendarRepository from '../repositories/calenderRepository';
import IcsService from '../utils/ics/generateICS';
import {CalendarEvent} from '../types/calender.types';
import logger from '../utils/logger';
import IcsEventHandler from '../utils/ics/icsEventHandler';

export default class CalendarService {
    static async doSubscribeToCalendar(userId: string) {
        const userData = await CalendarRepository.getUserAndFriendsBirthdays(userId);

        if (!userData) {
            logger.warn(`No user found with ID: ${userId}`);
            throw new Error('User not found');
        }

        const Events: CalendarEvent[] = [];

        if (userData.dateOfBirth) {
            const personalBirthday = IcsEventHandler.createBirthdayEvents(
                {
                    id: userData.id,
                    name: userData.name,
                    preferredName: userData.displayName || userData.name,
                    dateOfBirth: userData.dateOfBirth
                },
                'personal'
            );
            if (personalBirthday) {
                Events.push(personalBirthday);
            }
        }

        userData.friends.forEach((friend) => {
            if (friend.dateOfBirth) {
                const friendBirthday = IcsEventHandler.createBirthdayEvents(
                    {
                        id: friend.id,
                        name: friend.name,
                        preferredName: friend.preferredName || friend.name,
                        dateOfBirth: friend.dateOfBirth
                    },
                    'friend'
                );
                if (friendBirthday) {
                    Events.push(friendBirthday);
                }
            }
        });
        return IcsService.generateICS(Events);
    }
}

