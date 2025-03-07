import {CalendarEvent} from '../../types/calender.types';

export default class IcsService {
    static generateICS(events: CalendarEvent[]): string {
        const validEvents = events.filter((event) => event !== null);

        const icsContent = validEvents
            .map((event) => {
                const isAllDay = this.isAllDayEvent(event.start, event.end);
                const dtStart = isAllDay ? this.formatDateForICSAllDay(event.start) : this.formatDateForICSLTZ(event.start);
                const dtEnd = isAllDay ? this.formatDateForICSAllDay(this.getNextDay(event.end)) : this.formatDateForICSLTZ(event.end);

                return `BEGIN:VEVENT
UID:${event.id}-${Date.now()}
SUMMARY:${this.foldLine(event.title)}
DESCRIPTION:${this.foldLine(event.description)}
DTSTART:${dtStart}
DTEND:${dtEnd}
RRULE:FREQ=YEARLY
END:VEVENT`;
            })
            .join('\n');

        return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Birthday Calendar//EN\n${icsContent}\nEND:VCALENDAR`;
    }

    /**
     * Format date for ICS standard (Local Time with Time Zone)
     */
    private static formatDateForICSLTZ(date: Date): string {
        const pad = (num: number) => String(num).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        const offsetMinutes = date.getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
        const offsetMin = Math.abs(offsetMinutes % 60);
        const offsetSign = offsetMinutes > 0 ? '-' : '+';

        return `${year}${month}${day}T${hours}${minutes}${seconds}${offsetSign}${pad(offsetHours)}${pad(offsetMin)}`;
    }

    /**
     * Format date for ICS standard (All-day format)
     */
    private static formatDateForICSAllDay(date: Date): string {
        return date.toISOString().split('T')[0].replace(/-/g, '');
    }

    /**
     * Get the next day for all-day events (ICS standard requires DTEND to be the day after)
     */
    private static getNextDay(date: Date): Date {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay;
    }

    /**
     * Check if an event is an all-day event
     */
    private static isAllDayEvent(start: Date, end: Date): boolean {
        return start.getUTCHours() === 0 && start.getUTCMinutes() === 0 && end.getUTCHours() === 23 && end.getUTCMinutes() === 59;
    }

    /**
     * Fold long lines to comply with ICS standards (max 75 chars per line)
     */
    private static foldLine(input: string): string {
        return input.replace(/(.{1,73})/g, '$1\n ');
    }
}

