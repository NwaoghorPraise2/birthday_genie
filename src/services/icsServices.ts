import logger from '../utils/logger';
import IcsEventHandler from '../utils/ics/icsEventHandler';
import {EventAttributes} from 'ics';
import {Event} from '../types/calender.types';

export default class IcsService {
    public static async createEvent(eventList: Event[]): Promise<string> {
        if (eventList.length === 0) {
            throw new Error('No events provided to create ICS.');
        }

        const formattedEvents: EventAttributes = {
            title: 'Birthdays from Birthday-Genie',
            start: IcsService.formatDateForICS(eventList[0].dateOfBirth),
            description: eventList[0].description || 'No description provided',
            categories: [eventList[0].relationship],
            organizer: {
                name: 'Birthday-Genie',
                email: 'support@automusstech.com'
            },
            duration: {hours: 24}
        };

        try {
            const icsContent = await IcsEventHandler.createEvent(formattedEvents);
            return icsContent as string;
        } catch (error) {
            logger.error('Error generating ICS:', {error});
            throw new Error('Could not generate calendar file.');
        }
    }

    public static formatDateForICS(dob: string): [number, number, number] {
        const [day, month, year] = dob.split('-').map(Number);
        return [year, month, day];
    }
}

