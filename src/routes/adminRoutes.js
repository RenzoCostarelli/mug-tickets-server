import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import {ValidationsMiddlewares} from '../middlewares/validationMiddleware.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();

import { AdminController } from '../controllers/adminController.js';
const adminController = new AdminController();

// Route: GET /api/admin
// Middleware: validateJWT (JWT validation middleware) and CacheMiddleware (cache middleware)
// Controller: adminController.getAll
router.get('/',
    [
        validationsMiddlewares.validateJWT,
        //CacheMiddleware()
    ], 
    adminController.getAll);

// Route: POST /api/admin
// Middleware: validateFields (Express validator middleware)
// Controller: adminController.create
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
    adminController.create);

// Route: GET /api/admin/:id
// Middleware: validateJWT (JWT validation middleware)
// Controller: adminController.get
router.get('/:id', [
        validationsMiddlewares.validateJWT,
    ], 
    adminController.get);

// Route: PUT /api/admin/:id
// Middleware: validateJWT (JWT validation middleware) and validateFields (Express validator middleware)
// Controller: adminController.update
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
    adminController.update);

// Route: DELETE /api/admin/:id
// Middleware: validateJWT (JWT validation middleware)
// Controller: adminController.delete
router.delete('/:id',
    [
        validationsMiddlewares.validateJWT
    ], 
    adminController.delete);

export {
    router
};