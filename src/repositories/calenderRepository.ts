import db from '../config/db';
import logger from '../utils/logger';

export default class CalendarRepository {
    /**
     * Retrieve user and friends' birthdays
     * @param userId - ID of the user
     * @returns User data with friends' information
     */
    static async getUserAndFriendsBirthdays(userId: string) {
        try {
            // Validate input
            if (!userId) {
                throw new Error('Invalid user ID');
            }

            const userData = await db.user.findUnique({
                where: {id: userId},
                select: {
                    id: true,
                    name: true,
                    username: true,
                    dateOfBirth: true,
                    description: true,
                    displayName: true,
                    friends: {
                        select: {
                            id: true,
                            name: true,
                            preferredName: true,
                            dateOfBirth: true,
                            relationship: true,
                            description: true
                        }
                    }
                }
            });

            if (!userData) {
                logger.warn(`No user found with ID: ${userId}`);
                return null;
            }

            return userData;
        } catch (error) {
            logger.error('Error retrieving user and friends birthdays', {
                userId,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
}

