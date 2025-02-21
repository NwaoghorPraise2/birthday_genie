export interface Event {
    id: string;
    name: string;
    username?: string; // User's username (optional for friends)
    dateOfBirth: string; // Expected format: "DD-MM-YYYY"
    description?: string; // Optional event description
    phoneNumber?: string; // Optional phone number
    displayName?: string; // User's display name

    // Friend-specific properties
    preferredName?: string;
    profilePic?: string;
    email?: string;

    relationship: string; // e.g., "Friend", "Brother", "Colleague", etc.
}

