/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import bcrypt from 'bcrypt';
import config from '../config/config';

class PasswordHelpers {
    public static async hashPassword(password: string){
        return await bcrypt.hash(password, Number(config.HASH_SALT));
    }

    public static async comparePassword(password: string, hashPassword: string){
        return await bcrypt.compare(password, hashPassword);
    }
}

export default PasswordHelpers;