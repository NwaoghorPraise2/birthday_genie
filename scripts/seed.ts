/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import db from '../src/config/db';
import logger from '../src/utils/logger';
import PasswordHelpers from '../src/utils/hash';


class SeedDB {
    async seedData():Promise<void> {
        const count = await db.user.count() as number;
        if(count > 0)
                await db.user.deleteMany();

        for(let i = 0; i < 10; i++){
            await db.user.create
            ({
                data: {
                    username:`user-name-${i}`,
                    email: `user-${i}@genie.com`,
                    password: await PasswordHelpers.hashPassword(`user-pass${i}`)
                }
            }) 
        }
        logger.info(`User seeded successfully`)
    }
}

const seed = new SeedDB

if (require.main === module) {
    void seed.seedData().then(() => {
        logger.info('Data seed done!')
        process.exit()
    });
}