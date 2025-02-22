import db from '../src/config/db';
import logger from '../src/utils/logger';
import PasswordHelpers from '../src/utils/hash';

class SeedDB {
    async clearDatabase(): Promise<void> {
        await db.$transaction([
            db.history.deleteMany(),
            db.message.deleteMany(),
            db.notifications.deleteMany(),
            db.accountSettings.deleteMany(),
            db.friends.deleteMany(),
            db.user.deleteMany()
        ]);
        logger.info('Database cleared successfully');
    }

    async seedUsers(): Promise<{id: string; username: string}[]> {
        const users = await Promise.all(
            Array.from({length: 10}).map(async (_, i) =>
                db.user.create({
                    data: {
                        username: `UserName${i}`,
                        email: `user${i}@genie.com`,
                        password: await PasswordHelpers.doHashing(`UserPassss@${i}`),
                        name: `User ${i}`,
                        phoneNumber: `+1234567890${i}`,
                        profilePic: `https://picsum.photos/seed/user${i}/200`
                    }
                })
            )
        );
        logger.info('Users seeded successfully');
        return users;
    }

    async seedFriends(users: {id: string}[]): Promise<{id: string}[]> {
        const friends = users.flatMap((user, i) =>
            Array.from({length: 2}).map(() =>
                db.friends.create({
                    data: {
                        userId: user.id,
                        name: `Friend${i}`,
                        preferredName: `F${i}`,
                        dateOfBirth: '1990-01-01',
                        phoneNumber: `+1987654321${i}`,
                        profilePic: `https://picsum.photos/seed/friend${i}/200`,
                        email: `friend${i}@genie.com`,
                        relationship: 'Friend',
                        description: 'A close friend',
                        isDeleted: false
                    }
                })
            )
        );
        const createdFriends = await Promise.all(friends);
        logger.info('Friends seeded successfully');
        return createdFriends;
    }

    async seedAccountSettings(users: {id: string}[]): Promise<void> {
        await Promise.all(
            users.map((user) =>
                db.accountSettings.create({
                    data: {
                        userId: user.id,
                        birthdayNotificationTime: 8,
                        timeToSendBirthdayMessages: 10,
                        useNickNameInMessage: true,
                        defaultMessageChannel: 'WHATSAPP'
                    }
                })
            )
        );
        logger.info('Account settings seeded successfully');
    }

    async seedNotifications(users: {id: string}[]): Promise<void> {
        await Promise.all(
            users.flatMap((user, i) =>
                Array.from({length: 2}).map(() =>
                    db.notifications.create({
                        data: {
                            userId: user.id,
                            title: `Notification ${i}`,
                            message: `This is notification ${i}`,
                            tag: 'general',
                            isDeleted: false,
                            isRead: false
                        }
                    })
                )
            )
        );
        logger.info('Notifications seeded successfully');
    }

    async seedMessages(users: {id: string; username: string}[]): Promise<{id: string}[]> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const messages = users.flatMap((user, i) =>
            Array.from({length: 2}).map(() =>
                db.message.create({
                    data: {
                        userId: user.id,
                        status: 'DRAFT',
                        message: `Hello from ${user.username}`,
                        tag: 'HUMAN',
                        isDeleted: false
                    }
                })
            )
        );
        const createdMessages = await Promise.all(messages);
        logger.info('Messages seeded successfully');
        return createdMessages;
    }

    async seedHistory(users: {id: string}[], friends: {id: string}[]): Promise<void> {
        await Promise.all(
            users.flatMap((user) =>
                friends.map((friend) =>
                    db.history.create({
                        data: {
                            userId: user.id,
                            friendId: friend.id,
                            timeSent: new Date(),
                            status: 'SENT',
                            channel: 'WHATSAPP'
                        }
                    })
                )
            )
        );
        logger.info('History seeded successfully');
    }

    async seedData(): Promise<void> {
        await this.clearDatabase();

        const users = await this.seedUsers();
        const friends = await this.seedFriends(users);

        await Promise.all([
            this.seedAccountSettings(users),
            this.seedNotifications(users),
            this.seedMessages(users),
            this.seedHistory(users, friends)
        ]);

        logger.info('All data seeded successfully');
    }
}

const seed = new SeedDB();

if (require.main === module) {
    void seed.seedData().then(() => {
        logger.info('Data seeding complete');
        process.exit(0);
    });
}

