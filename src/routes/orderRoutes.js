import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import { ValidationsMiddlewares } from '../middlewares/validationMiddleware.js';
import { OrderController } from '../controllers/orderController.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();

const orderController = new OrderController();

// Route: GET /api/ticketType
// Middleware: CacheMiddleware (cache middleware)
// Controller: orderController.getAll
router.get('/', 
    [
        //validationsMiddlewares.validateIfAdmin,
        //CacheMiddleware()
    ], 
    orderController.getAll);

// Route: GET /api/ticketType/query
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: orderController.filter
router.get('/query', [
        validationsMiddlewares.validateIfAdmin,
    ], 
    orderController.filter);

// Route: POST /api/ticketType
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: orderController.create
router.post('/', 
    [
        //validationsMiddlewares.validateJWT,
        //validationsMiddlewares.validateIfAdmin,
        check('eventId', 'event is required').not().isEmpty(),
        check('quantity', 'Quantity is required').not().isEmpty(),
        check('expirationDate', 'expirationDate purchase deadline is required').not().isEmpty(),
        validationsMiddlewares.validateFields,
    ],
    orderController.create);

// Route: GET /api/ticketType/:id
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: orderController.get
router.get('/:id', [
        //validationsMiddlewares.validateIfAdmin,
    ], 
    orderController.get);

// Route: PUT /api/ticketType/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: orderController.update
router.put('/:id', 
    [
        //validationsMiddlewares.validateJWT,
        //validationsMiddlewares.validateIfAdmin,
        //check('status', 'Status is required').not().isEmpty(),
        //check('type', 'Ticket type is required').not().isEmpty(),
        //check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(), 
        validationsMiddlewares.validateFields
    ], 
    orderController.update);

// Route: PATCH /api/ticketType/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: orderController.update
router.patch('/:id', 
[
    //validationsMiddlewares.validateJWT,
    //validationsMiddlewares.validateIfAdmin,
    check('status', 'Status is required').not().isEmpty(),
    //check('type', 'Ticket type is required').not().isEmpty(),
    //check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(), 
    validationsMiddlewares.validateFields
], 
orderController.updateStatus);

// Route: DELETE /api/ticketType/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: orderController.delete
router.delete('/:id',
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
    ], 
    orderController.delete);

export {
    router
};