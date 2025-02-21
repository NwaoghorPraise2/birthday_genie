import CalenderRepository from '../repositories/calenderRepository';
import IcsService from './icsServices';
import {Event} from '../types/calender.types';

export default class CalenderService {
    static async doSubscribeToCalender(userId: string): Promise<string> {
        const data = await CalenderRepository.getUserAndFriendsBirthdays(userId);

        if (!data) {
            throw new Error('User data not found');
        }

        // Ensure correct array structure
        const eventList: Event[] = [
            {
                id: data.id,
                name: data.name ?? '',
                username: data.username,
                dateOfBirth: data.dateOfBirth ?? '',
                description: data.description ?? '',
                phoneNumber: data.phoneNumber ?? undefined,
                displayName: data.displayName ?? undefined,
                relationship: 'Self' // Default for the user
            },
            ...data.friends.map((friend) => ({
                id: friend.id,
                name: friend.name ?? '',
                preferredName: friend.preferredName ?? '',
                dateOfBirth: friend.dateOfBirth ?? '',
                phoneNumber: friend.phoneNumber ?? '',
                profilePic: friend.profilePic ?? '',
                email: friend.email ?? '',
                relationship: friend.relationship ?? '',
                description: friend.description ?? ''
            }))
        ];

        const icsData = await IcsService.createEvent(eventList);
        return icsData;
    }
}

