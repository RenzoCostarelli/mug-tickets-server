import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import { ValidationsMiddlewares } from '../middlewares/validationMiddleware.js';
import { TicketTypeController } from '../controllers/ticketTypeController.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();

const ticketTypeController = new TicketTypeController();

// Route: GET /api/ticketType
// Middleware: CacheMiddleware (cache middleware)
// Controller: ticketTypeController.getAll
router.get('/', 
    [
        //validationsMiddlewares.validateIfAdmin,
        //CacheMiddleware()
    ], 
    ticketTypeController.getAll);

// Route: GET /api/ticketType/query
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: ticketTypeController.filter
router.get('/query', [
        validationsMiddlewares.validateIfAdmin,
    ], 
    ticketTypeController.filter);

// Route: POST /api/ticketType
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: ticketTypeController.create
router.post('/', 
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
        check('date', 'Date is required').not().isEmpty(),
        check('price', 'Price is required').not().isEmpty(),
        check('type', 'Ticket type is required').not().isEmpty(),
        check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(),
        validationsMiddlewares.validateFields,
    ],
    ticketTypeController.create);

// Route: GET /api/ticketType/:id
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: ticketTypeController.get
router.get('/:id', [
        //validationsMiddlewares.validateIfAdmin,
    ], 
    ticketTypeController.get);

// Route: PUT /api/ticketType/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: ticketTypeController.update
router.put('/:id', 
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
        check('date', 'Date is required').not().isEmpty(),
        check('type', 'Ticket type is required').not().isEmpty(),
        check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(), 
        validationsMiddlewares.validateFields
    ], 
    ticketTypeController.update);

// Route: DELETE /api/ticketType/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: ticketTypeController.delete
router.delete('/:id',
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
    ], 
    ticketTypeController.delete);

export {
    router
};