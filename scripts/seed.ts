import db from '../src/config/db';
import logger from '../src/utils/logger';


class SeedDB {
    async seedData():Promise<void> {
        for(let i = 0; i < 10; i++){
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            await db.user.create
            ({
                data: {
                    username:`user-name-${i}`,
                    name: `user-${i}@genie.com`,
                    email: `user-pass${i}`,
                    password: 'XXXXXXXX'
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