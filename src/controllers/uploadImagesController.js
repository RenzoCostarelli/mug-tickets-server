import { response } from 'express';
//import { uuidv4 } from 'uuid';
import { updateImages } from '../helpers/updateImage.js';
import { uploadCloudImage } from '../helpers/cloudinaryFiles.js';

/**
 * Controller class for handling image upload operations.
 */
class UploadImagesController {    
    constructor(){}

    /**
     * Upload an image for a specific type and ID.
     *
     * @param {Object} req - Express request object containing the type and ID in the request parameters and the image file in the request files.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the uploaded image filename or an error message.
     */
    async upload(req, res = response) {   
      try{
        const { type, eventId, url } = req.body;
        
        await updateImages({ type, eventId, url });
            
        res.status(200).json({
            ok: true,
            msg: "File uploaded.",
            type, 
            eventId, 
            url 
        });        
      } catch(err) {
        return res.status(500).json({
          ok: false,
          msg : err.message || 'asdadsa'
        });
      }
    }

}

export {
  UploadImagesController
};
