import { Router } from 'express';
const router = Router();

import { MercadopagoController } from '../controllers/mercadopagoController.js';
const mercadopago = new MercadopagoController();

// Route: POST /api/checkout/create_preference
// Controller: mercadopago.create (Controller method to handle the creation of MercadoPago preference)
router.post('/create_preference', mercadopago.create);

// Route: GET /api/checkout/feedback
// Controller: mercadopago.feedback (Controller method to handle MercadoPago feedback after payment)
router.get('/feedback', mercadopago.feedback);

export {
    router
};