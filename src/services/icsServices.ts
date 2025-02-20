import logger from '../utils/logger';
import IcsEventHandler from '../utils/ics/icsEventHandler';
import {EventAttributes} from 'ics';
import {EventList} from '../types/calender.types';

export default class IcsService {
    public static async createEvent(eventList: EventList) {
        const formattedEvents = eventList.events.map((event) => ({
            title: 'Birthdays from Birthday-Genie',
            start: IcsService.formatDateForICS(event.dateOfBirth),
            description: event.description || 'No description provided',
            categories: event.relationship,
            organizer: {
                name: 'Birthday-Genie',
                email: 'support@automusstech.com'
            }
        })) as unknown as EventAttributes;

        try {
            const icsContent = await IcsEventHandler.createEvent(formattedEvents);
            return icsContent as string;
        } catch (error) {
            logger.error('Error generating ICS:', {error});
            throw new Error('Could not generate calendar file.');
        }
    }

    public static formatDateForICS(dob: string) {
        const [day, month, year] = dob.split('-').map(Number);
        return [year, month, day];
    }
}

