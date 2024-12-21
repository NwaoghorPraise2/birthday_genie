import multer from 'multer';
import cloudinary from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import config from '../../config/config';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: config.CLOUD_NAME as string,
    api_key: config.API_KEY as string,
    api_secret: config.API_SECRET as string
});

// Create Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2
});

// Create multer upload parser
const parser = multer({storage});

export const singleUpload = parser.single('profilePic');
export const multipleUpload = parser.array('image', 10);

