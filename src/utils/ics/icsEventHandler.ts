import {parse, isValid} from 'date-fns';
import {CalendarEvent, EventType} from '../../types/calender.types';
import logger from '../logger';

export default class IcsEventHandler {
    /**
     * Parse date from DD-MM-YYYY format
     * @param dateString Date in DD-MM-YYYY format
     * @returns Date object or null if invalid
     */
    static parseDateFromDDMMYYYY(dateString: string): Date | null {
        if (!dateString) return null;
        const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());

        return isValid(parsedDate) ? parsedDate : null;
    }

    /**
     * Generate descriptive text for birthday event
     */
    private static generateBirthdayDescription(
        person: {
            id: string;
            name: string | null;
            preferredName?: string | null;
            displayName?: string | null;
            dateOfBirth: string | null;
        },
        eventType: EventType
    ): string {
        return eventType === 'personal' ? `Celebrating another year of life!🫧` : `Birthday of $${person.preferredName || person.name}`;
    }

    static createBirthdayEvents(
        person: {
            dateOfBirth: string | null;
            id: string;
            preferredName: string | null;
            name: string | null;
        },
        eventType: EventType
    ): CalendarEvent | null {
        const birthdate = this.parseDateFromDDMMYYYY(person.dateOfBirth as string);

        if (!birthdate) {
            logger.warn('Invalid birthdate', {person});
            return null;
        }

        const currentYear = new Date().getFullYear();
        const birthdayThisYear = new Date(currentYear, birthdate.getMonth(), birthdate.getDate());

        return {
            id: `birthday-${person.id}-${currentYear}`,
            title: eventType === 'personal' ? 'My Birthday' : `${person.preferredName || person.name}'s Birthday`,
            description: this.generateBirthdayDescription(person, eventType),
            start: birthdayThisYear,
            end: new Date(birthdayThisYear.getFullYear(), birthdayThisYear.getMonth(), birthdayThisYear.getDate(), 23, 59, 59),
            isAnnual: true
        };
    }
}

