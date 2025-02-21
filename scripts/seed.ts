import db from '../src/config/db';
import logger from '../src/utils/logger';
import PasswordHelpers from '../src/utils/hash';

class SeedDB {
    async seedData(): Promise<void> {
        // Delete existing data
        await db.history.deleteMany();
        await db.message.deleteMany();
        await db.notifications.deleteMany();
        await db.accountSettings.deleteMany();
        await db.friends.deleteMany();
        await db.user.deleteMany();

        const users = [];

        // Seed Users
        for (let i = 0; i < 10; i++) {
            const user = await db.user.create({
                data: {
                    username: `user-name-${i}`,
                    email: `user-${i}@genie.com`,
                    password: await PasswordHelpers.doHashing(`user-pass${i}`)
                }
            });
            users.push(user);
        }
        logger.info(`Users seeded successfully`);

        // Seed Friends
        const friends = [];
        for (const user of users) {
            for (let i = 0; i < 2; i++) {
                // Each user has 2 friends
                const friend = await db.friends.create({
                    data: {
                        userId: user.id,
                        name: `Friend-${i}`,
                        preferredName: `F-${i}`,
                        email: `friend-${i}@genie.com`,
                        relationship: 'Friend',
                        dateOfBirth: '1990-01-01'
                    }
                });
                friends.push(friend);
            }
        }
        logger.info(`Friends seeded successfully`);

        // Seed AccountSettings
        for (const user of users) {
            await db.accountSettings.create({
                data: {
                    userId: user.id,
                    birthdayNotificationTime: 8,
                    timeToSendBirthdayMessages: 10,
                    useNickNameInMessage: false,
                    defaultMessageChannel: 'WHATSAPP'
                }
            });
        }
        logger.info(`AccountSettings seeded successfully`);

        // Seed Notifications
        for (const user of users) {
            for (let i = 0; i < 2; i++) {
                // Each user gets 2 notifications
                await db.notifications.create({
                    data: {
                        userId: user.id,
                        title: `Notification ${i}`,
                        message: `Message content for notification ${i}`
                    }
                });
            }
        }
        logger.info(`Notifications seeded successfully`);

        // Seed Messages
        const messages = [];
        for (const user of users) {
            for (let i = 0; i < 2; i++) {
                // Each user has 2 messages
                const message = await db.message.create({
                    data: {
                        userId: user.id,
                        status: 'DRAFT',
                        message: `Hello from user-${user.username}`
                    }
                });
                messages.push(message);
            }
        }
        logger.info(`Messages seeded successfully`);

        // Seed History
        for (const user of users) {
            for (const friend of friends) {
                await db.history.create({
                    data: {
                        userId: user.id,
                        friendId: friend.id,
                        timeSent: new Date(),
                        status: 'SENT',
                        channel: 'WHATSAPP'
                    }
                });
            }
        }
        logger.info(`History seeded successfully`);
    }
}

const seed = new SeedDB();

if (require.main === module) {
    void seed.seedData().then(() => {
        logger.info('Data seed done!');
        process.exit();
    });
}

