const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/userModel');
const { generateJWT } = require('../config/authentication');

class UserController {    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const users = await User.find({}).populate('purchasedTickets', {
            purchaser: 1,
            attendee: 1, 
            validated: 1, 
            purchased: 1, 
            purchaseDate: 1, 
            validationDate: 1, 
            qrCode: 1,
            purchaserId: 1,
            ticketNumber: 1
        });

        res.status(200).json({
          ok: true,
          users
        });

      } catch (err) {
        console.error(`Error occurred while fetching users - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to fetch ticket information',
        });      
      }
    }
  
    async filter(req, res = response) {
      try {
        const user = await User.find(req.query);
        if (user.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No events matched your search'
            });
        } 

        res.status(200).json({
          ok: true,
          user
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
    
    async create(req, res = response) {
      const { 
        dni, 
        firstName, 
        lastName,
        email,
        password
      } = req.body;
      
      try {       
        const existEmail = await User.findOne({ email });

        if(existEmail){
          return res.status(400).json({
            ok: false,
            msg: 'There is an error with the email'
          })
        }

        const user = new User({ 
          dni, 
          firstName, 
          lastName,
          email,
          password
        });

        //encrypt
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt );

        await user.save();

        const token = await generateJWT(user._id);
        
        res.status(200).json({
          ok: true,
          user,
          token
        });
      } catch (err) {
        console.error(`Error occurred while creating user - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to create user',
        });      
      }
    }
  
    async get(req, res = response) {
      const { id } = req.params;      
      try {
        const user = await User.findById(id).populate('purchasedTickets', {
          purchaser: 1,
          attendee: 1, 
          validated: 1, 
          purchased: 1, 
          purchaseDate: 1, 
          validationDate: 1, 
          qrCode: 1,
          purchaserId: 1,
          ticketNumber: 1
      });

        if (!user) {
          return res.status(404).json({
            ok: false,
            error: 'User not found',
          });
        }
        
        res.status(200).json({
          ok: true,
          user
        });     
      } catch (err) {
        console.error(`Error occurred while fetching user with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to fetch user information',
        });      
      }
    }
  
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
        const user = await User.findByIdAndUpdate(id, 
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

        if (!user) {
          return res.status(404).json({
            ok: false,
            error: 'User not found',
          });
        }  

        res.status(200).json({
          ok: true,
          user
        });
      } catch (err) {
        console.error(`Error occurred while updating user with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to update user information',
        });
      }
    }

    async delete(req, res = response) {
      const { id } = req.params;

      try {
        const user = await User.findByIdAndRemove(id, { new: true });
        if (!user) {
          return res.status(404).json({
            ok: false,
            error: 'User not found',
          });
        }

        res.status(200).json({
          ok: true
        });
      } catch (err) {
        console.error(`Error occurred while deleting user with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to delete user information',
        });
      }
    }
}

module.exports = {
  UserController
};
