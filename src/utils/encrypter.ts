import {randomBytes, createCipheriv, createDecipheriv} from 'crypto';
import config from '../config/config';

export default class EncryptService {
    static encryptEntity(token: string) {
        const iv = randomBytes(16);
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(config.CRYPTO_SECRET as string), iv);
        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + encrypted;
    }
    static decryptEntity(token: string) {
        const iv = Buffer.from(token.substring(0, 32), 'hex');
        const encryptedToken = token.substring(32);
        const decipher = createDecipheriv('aes-256-cbc', Buffer.from(config.CRYPTO_SECRET as string), iv);
        let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

