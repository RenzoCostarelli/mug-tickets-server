import fs from 'fs';

import { User } from '../models/userModel.js';
import { Event } from '../models/eventModel.js';

/**
 * Function to update the image path for a user or event based on the given options.
 * @param {Object} options - Options object containing 'type', 'id', and 'fileName'.
 */
const updateImages = async (options = {}) => {
    const { type, eventId, url } = options;

    try{
        // Define actions based on the 'type' (user, events, tickets)
        const action = {
            user: async () => {
                // Find the user by ID
                const user = await User.findById(id);
                if(!user) {
                    return false;
                }
    
                // Replace the previous image path for the user
                _replacePrevPath({
                    type, 
                    image: user.image
                });
    
                // Update the user's image with the new file name and save changes
                user.image = url;
                await user.save();
                return true;
            },
            events: async () => {
                // Find the event by ID
                const event = await Event.findById(eventId);           
                if(!event) {
                    return false;
                }
    
                // Replace the previous image path for the event
                _replacePrevPath({
                    type, 
                    image: event.image
                });
    
                // Update the event's image with the new file name and save changes
                event.image = url;
                await event.save();
                return true;
            },
            tickets: () => {
                // Tickets functionality can be added here if required in the future
            }
        };        
        action[type]();
    } catch(err) {
        console.log(err)
    }
};

/**
 * Function to replace the previous image path with the new image path for a user or event.
 * @param {Object} imageData - Image data object containing 'type' and 'image' (file name).
 */
const _replacePrevPath = (imageData = {}) => {
    const { type = '', url = ''} = imageData;
    const prevPath = url;

    if (fs.existsSync(prevPath)) {
        // remove previous image
        fs.unlinkSync(prevPath);
    }
};

export {
    updateImages
};