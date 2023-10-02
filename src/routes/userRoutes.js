import { Router } from 'express';
const router = Router();

import { check } from 'express-validator'
import { ValidationsMiddlewares } from '../middlewares/validationMiddleware.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();

import { UserController } from '../controllers/userController.js';
const userController = new UserController();

// Route: GET /api/users
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Middleware: CacheMiddleware (Caches the response if available)
// Controller: userController.getAll (Controller method to get all users)
router.get('/',
    [
        validationsMiddlewares.validateJWT,
        //CacheMiddleware()
    ], 
    userController.getAll);

// Route: POST /api/users
// Middleware: validateFields (Validates request body fields)
// Controller: userController.create (Controller method to create a new user)
router.post('/',
    [
        //validationsMiddlewares.validateJWT,
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('dni', 'Dni is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),  
        validationsMiddlewares.validateFields,       
    ], 
    userController.create);

// Route: GET /api/users/:id
// Controller: userController.get (Controller method to get a specific user by ID)
router.get('/:id', userController.get);

// Route: PUT /api/users/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Middleware: validateFields (Validates request body fields)
// Controller: userController.update (Controller method to update a user by ID)
router.put('/:id',
    [
        validationsMiddlewares.validateJWT,
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('dni', 'Dni is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(), 
        check('email', 'Email is required').isEmail(),
        validationsMiddlewares.validateFields,       
    ], 
    userController.update);

// Route: DELETE /api/users/:id
// Middleware: validateJWT (Validates the JSON Web Token in the request header)
// Controller: userController.delete (Controller method to delete a user by ID)
router.delete('/:id',
    [
        validationsMiddlewares.validateJWT
    ], 
    userController.delete);

export {
    router
};