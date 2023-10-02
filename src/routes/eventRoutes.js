import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';
import {ValidationsMiddlewares} from '../middlewares/validationMiddleware.js';
import { EventController } from '../controllers/eventController.js';
import * as CacheMiddleware from '../middlewares/cacheMiddleware.js';

const validationsMiddlewares = new ValidationsMiddlewares();

const eventController = new EventController();

// Route: GET /api/events
// Middleware: CacheMiddleware (cache middleware)
// Controller: eventController.getAll
router.get('/', 
    [
        //validationsMiddlewares.validateIfAdmin,
        //CacheMiddleware()
    ], 
    eventController.getAll);

// Route: GET /api/events/query
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: eventController.filter
router.get('/query', [
        validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.filter);

// Route: POST /api/events
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: eventController.create
router.post('/', 
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
        check('creatorId', 'Creator id is required').not().isEmpty(),
        check('eventType', 'Event type is required').not().isEmpty(),
        check('title', 'Show title is required').not().isEmpty(),
        check('description', 'Show description is required').not().isEmpty(),
        check('address', 'Show address is required').not().isEmpty(),
        //check('dates', 'Dates array is required and must be an array').isArray({ min: 1 }),
        //check('dates.*.date', 'Date is required for each ticket').not().isEmpty(), 
        validationsMiddlewares.validateFields,
    ],
    eventController.create);

// Route: GET /api/events/:id
// Middleware: validateIfAdmin (Admin validation middleware)
// Controller: eventController.get
router.get('/:id', [
        //validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.get);

// Route: PUT /api/events/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: eventController.update
router.put('/:id', 
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
        check('eventType', 'Event type is required').not().isEmpty(),
        //check('ticketPurchaseDeadline', 'Ticket purchase deadline is required').not().isEmpty(),
        check('title', 'Show title is required').not().isEmpty(),
        check('description', 'Show description is required').not().isEmpty(),
        check('address', 'Show address is required').not().isEmpty(),
        //check('date', 'Show date is required').not().isEmpty(),  
        validationsMiddlewares.validateFields
    ], 
    eventController.update);

// Route: DELETE /api/events/:id
// Middleware: validateIfAdmin (Admin validation middleware) and validateJWT (JWT validation middleware)
// Controller: eventController.delete
router.delete('/:id',
    [
        validationsMiddlewares.validateJWT,
        validationsMiddlewares.validateIfAdmin,
    ], 
    eventController.delete);

export {
    router
};