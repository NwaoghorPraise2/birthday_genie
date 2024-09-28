/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import bcrypt from 'bcrypt';
import config from '../config/config';

class PasswordHelpers {
    public static async hashPassword(password: string){
        return await bcrypt.hash(password, Number(config.HASH_SALT)) as string;
    }

    public static async comparePassword(password: string, hashPassword: string){
        return await bcrypt.compare(password, hashPassword) as boolean;
    }
}

export default PasswordHelpers;