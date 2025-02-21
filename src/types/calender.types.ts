export interface Event {
    id: string;
    name: string;
    username?: string;
    dateOfBirth: string;
    description?: string;
    phoneNumber?: string;
    displayName?: string;

    preferredName?: string;
    profilePic?: string;
    email?: string;

    relationship: string;
}

