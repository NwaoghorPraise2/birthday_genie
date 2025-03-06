export interface IBirthDayPersona {
    id: string;
    name?: string;
    dateOfBirth: string;
    description?: string;
    displayName?: string;
    preferredName?: string;
    relationship?: string;
}

export interface IPerson {
    id: string;
    name: string;
    username: string;
    dateOfBirth: string;
    description?: string;
    displayName?: string;
    preferredName?: string;
    relationship?: string;
    friends?: IPerson[];
}

export interface IUserData {
    user: IPerson;
    friends: IPerson[];
}

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    isAnnual: boolean;
}

export type EventType = 'personal' | 'friend';

// export interface Event {
//     id: string;
//     name: string;
//     username?: string;
//     dateOfBirth: string;
//     description?: string;
//     phoneNumber?: string;
//     displayName?: string;

//     preferredName?: string;
//     profilePic?: string;
//     email?: string;

//     relationship: string;
// }

