import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_KEY,
  api_secret:  process.env.CLOUDINARY_SECRET 
});

const uploadCloudImage = async (file, folder = '') => {
    const arrBuf = file.buffer();
    const buffer = Buffer.from(arrBuf);
    console.log("🚀 ~ newFile:", buffer)
    
    return await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder
        }, (err, result) => {
            if(err) {
                reject(err);
            }  
            resolve(result);
        }).end(buffer);
    });
}

export {
    uploadCloudImage
};