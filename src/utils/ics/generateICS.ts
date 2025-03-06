import {CalendarEvent} from '../../types/calender.types';

export default class IcsService {
    static generateICS(events: CalendarEvent[]): string {
        const validEvents = events.filter((event) => event !== null);

        const icsContent = validEvents
            .map(
                (event) => `
            BEGIN:VEVENT
            UID:${event.id}
            SUMMARY:${event.title}
            DESCRIPTION:${event.description}
            DTSTART:${this.formatDateForICS(event.start)}
            DTEND:${this.formatDateForICS(event.end)}
            RRULE:FREQ=YEARLY
            END:VEVENT
                `
            )
            .join('\n');

        return `BEGIN:VCALENDAR
            VERSION:2.0
            PRODID:-//Birthday Calendar//EN
            ${icsContent}
            END:VCALENDAR`;
    }

    /**
     * Format date for ICS standard
     */
    private static formatDateForICS(date: Date): string {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }
}

