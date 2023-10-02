import { response } from 'express';
import bcryptjs from 'bcryptjs';

import { Admin } from '../models/adminModel.js';
import { generateJWT } from '../config/authentication.js';

/**
 * Controller class for handling admin-related operations.
 */
class AdminController {    
    constructor(){}

    /**
   * Get all admins from the database.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing an array of admins or an error message.
   */
    async getAll(req, res = response) {
      try {
        const admin = await Admin.find({}).populate('eventsCreatedList', {
            eventId: 1,
            eventType: 1, 
            ticketPurchaseDeadline: 1, 
            hasLimitedPlaces: 1, 
            title: 1,
            address: 1,
            date: 1,
            description: 1
        });

        res.status(200).json({
          ok: true,
          admin
        });

      } catch (err) {
        res.status(500).json({
          ok: false,
          error: 'Unable to fetch admin',
        });      
      }
    }
  
    /**
   * Filter admins based on the provided query parameters.
   *
   * @param {Object} req - Express request object containing query parameters.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing an array of filtered admins or an error message.
   */
    async filter(req, res = response) {
      try {
        const admin = await Admin.find(req.query);
        if (admin.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No admin matched your search'
            });
        } 

        res.status(200).json({
          ok: true,
          admin
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
    
    /**
   * Create a new admin with the provided data.
   *
   * @param {Object} req - Express request object containing the admin data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the newly created admin details and a JWT token or an error message.
   */
    async create(req, res = response) {
      const { 
        dni, 
        firstName, 
        lastName,
        email,
        password
      } = req.body;
      
      try {       
        const existEmail = await Admin.findOne({ email });

        if(existEmail){
          return res.status(400).json({
            ok: false,
            msg: 'There is an error with the email'
          })
        }

        const admin = new Admin({ 
          dni, 
          firstName, 
          lastName,
          email,
          password
        });

        //encrypt
        const salt = bcryptjs.genSaltSync();
        admin.password = bcryptjs.hashSync( password, salt );

        await admin.save();

        const token = await generateJWT(admin._id);
        
        res.status(200).json({
          ok: true,
          admin,
          token
        });
      } catch (err) {
        console.error(`Error occurred while creating user - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to create admin',
        });      
      }
    }
  
    /**
   * Get an admin by their ID.
   *
   * @param {Object} req - Express request object containing the admin ID in the request parameters.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the admin details or an error message if not found.
   */
    async get(req, res = response) {
      const { id } = req.params;      
      try {
        const admin = await Admin.findById(id).populate('eventsCreatedList', {
            eventId: 1,
            eventType: 1, 
            ticketPurchaseDeadline: 1, 
            hasLimitedPlaces: 1, 
            title: 1,
            address: 1,
            date: 1
        });

        if (!admin) {
          return res.status(404).json({
            ok: false,
            error: 'Admin not found',
          });
        }
        
        res.status(200).json({
          ok: true,
          admin
        });     
      } catch (err) {
        console.error(`Error occurred while fetching admin with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to fetch admin information',
        });      
      }
    }
  
    /**
   * Update an admin's information by their ID.
   *
   * @param {Object} req - Express request object containing the admin ID in the request parameters and updated data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the updated admin details or an error message if not found.
   */
    async update(req, res = response) {
      const id = req.params.id;
      const {         
        dni, 
        firstName, 
        lastName,
        email,
        password
      } = req.body;

      try {
        const admin = await Admin.findByIdAndUpdate(id, 
          { 
            dni,
            firstName,
            lastName,
            email,
            password
          }, 
          { 
            new: true 
          });

        if (!admin) {
          return res.status(404).json({
            ok: false,
            error: 'Admin not found',
          });
        }  

        res.status(200).json({
          ok: true,
          admin
        });
      } catch (err) {
        console.error(`Error occurred while updating admin with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to update admin information',
        });
      }
    }

    /**
   * Delete an admin by their ID.
   *
   * @param {Object} req - Express request object containing the admin ID in the request parameters.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response indicating success or failure of the delete operation.
   */
    async delete(req, res = response) {
      const { id } = req.params;

      try {
        const admin = await Admin.findByIdAndRemove(id, { new: true });
        if (!admin) {
          return res.status(404).json({
            ok: false,
            error: 'Admin not found',
          });
        }

        res.status(200).json({
          ok: true
        });
      } catch (err) {
        console.error(`Error occurred while deleting admin with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to delete admin information',
        });
      }
    }
}

export {
  AdminController
};
