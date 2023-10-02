import { response } from 'express';
import { validationResult } from 'express-validator';
import { Admin } from'./../models/adminModel.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
/**
 * Middleware class containing validation methods for request fields, JWT tokens, and admin privileges.
 */
class ValidationsMiddlewares {
    constructor() { }

    /**
     * Middleware to validate the request fields using express-validator.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} next - The next function to proceed to the next middleware or route handler.
     */
    validateFields(req, res = response, next) {
        const errors = validationResult( req );
    
        if(!errors.isEmpty()) {
          return res.status(400).json({
            ok: false,
            errors: errors.mapped()
          });
        }    
        next();        
    }

    /**
     * Middleware to validate the JWT token from the request header.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} next - The next function to proceed to the next middleware or route handler.
     */
    validateJWT(req, res = response, next) {    
      const token = req.header('x-token');

      if(!token) {
        return res.status(401).json({
          ok: false,
          msg: 'There is no token'
        });
      }

      try{
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );

        req.uid = uid;
        
        next();
      } catch(error) {
        return res.status(401).json({
          ok: false,
          msg: 'Wrong token'
        })
      }     
  }

  /**
     * Middleware to validate if the user has admin privileges based on the JWT token.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} next - The next function to proceed to the next middleware or route handler.
     */
  async validateIfAdmin(req, res = response, next) {
    const token = req.header('x-token');

    if(!token) {
      return res.status(401).json({
        ok: false,
        msg: 'There is no token'
      });
    }
    try{
      const { uid } = jwt.verify( token, process.env.JWT_SECRET );
      if(!uid){
        return res.status(401).json({
          ok: false,
          msg: "Can't access there."
        });
      } 
      /// validate if admin
      const admin = await Admin.findById(uid)
      if(!admin){
        return res.status(401).json({
          ok: false,
          msg: "Can't access there."
        });
      } 
      next();
    } catch(error) {
      return res.status(401).json({
        ok: false,
        msg: 'Wrong token'
      });
    }   
  }
}

export {
  ValidationsMiddlewares
};