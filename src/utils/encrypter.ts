import {randomBytes, createCipheriv, createDecipheriv, createHash} from 'crypto';
import config from '../config/config';

export default class EncryptService {
    static encryptEntity(token: string) {
        const iv = randomBytes(16);
        const key = createHash('sha256')
            .update(config.CRYPTO_SECRET as string)
            .digest();

        const cipher = createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return iv.toString('hex') + encrypted;
    }

    static decryptEntity(token: string) {
        if (!token || token.length < 32) {
            throw new Error('Invalid encrypted token format');
        }

        const iv = Buffer.from(token.slice(0, 32), 'hex');
        const encrypted = token.slice(32);
        const key = createHash('sha256')
            .update(config.CRYPTO_SECRET as string)
            .digest();

        const decipher = createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}

