import { Router } from 'express';
const router = Router();

import fileUpload from 'express-fileupload';

import { check } from 'express-validator';
import { ValidationsMiddlewares } from '../middlewares/validationMiddleware.js';
const validationsMiddlewares = new ValidationsMiddlewares();

import {UploadImagesController} from '../controllers/uploadImagesController.js';
const uploadImagesController = new UploadImagesController();

// Middleware: fileUpload (File upload middleware to handle image uploads)
/*router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './public/uploads',
}));
*/
// Route: PUT /api/upload/:type/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Middleware: validateFields (Validates request body fields)
// Controller: uploadImagesController.upload (Controller method to upload an image)
router.put('/', 
    [     
        validationsMiddlewares.validateJWT,         
        validationsMiddlewares.validateFields,
        check('url', 'Url is required').not().isEmpty(), 
        check('eventId', 'Event id is required').isEmail(), 
        check('type', 'Type is required').isEmail(), 
    ],
    uploadImagesController.upload);

export {
    router
};