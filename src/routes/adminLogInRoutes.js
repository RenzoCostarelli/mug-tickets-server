import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import { ValidationsMiddlewares }  from '../middlewares/validationMiddleware.js';
const validationsMiddlewares = new ValidationsMiddlewares();

import { AdminLogInController } from '../controllers/adminLogInController.js';
const adminLogInController = new AdminLogInController();

// Route: POST /api/login
// Middleware: Express validator middleware to check required fields (email and password)
// Middleware: validateFields (Custom middleware to validate field errors)
// Controller: logInController.login (Controller method to handle user login)
router.post('/', 
    [
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),        
        validationsMiddlewares.validateFields
    ],
    adminLogInController.login);
    
// Route: POST /api/login/google
// Middleware: Express validator middleware to check required fields (Google token)
// Middleware: validateFields (Custom middleware to validate field errors)
// Controller: logInController.googleSignIn (Controller method to handle Google sign-in)
router.post('/google', 
    [
        check('token', 'Google token is required').not().isEmpty(), 
        validationsMiddlewares.validateFields
    ],
    adminLogInController.googleSignIn);

export {
    router
};