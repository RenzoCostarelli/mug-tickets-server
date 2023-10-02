import { response } from 'express';
import mercadopago from 'mercadopago';
import 'dotenv/config'
import { createTransaction } from '../helpers/mercadopago.js';

/**
 * Controller class for handling Mercadopago-related operations.
 */
class MercadopagoController {    
    constructor(){}

    /**
     * Create a Mercadopago preference for payment.
     *
     * @param {Object} req - Express request object containing the item description, price, and quantity in the request query.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the created preference ID and body from Mercadopago, or an error message.
     */
    async create(req, res = response) {
        try {
            
            const { description, price, quantity } = req.query;
            // REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
            mercadopago.configure({
                access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
            });
        
            let preference = {
                items: [
                    {
                        title: description,
                        unit_price: Number(price),
                        quantity: Number(quantity),
                    }
                ],
                back_urls: {
                    success: "./feedback",
                    failure: "./feedback",
                    pending: "./feedback"
                },
                auto_return: "approved",
            };
        
            const response = await mercadopago.preferences.create(preference);
            if (response) {
                console.log(response)
                return res.status(200).json({
                    ok: true,
                    id: response.body.id,
                    body: response.body
                });
            }   
            res.status(500).json({ 
                ok: false, 
                error: 'Algo salió mal con MP' 
            });   

        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message
            });
        }
    }

    /**
     * Handle the feedback from Mercadopago after payment.
     *
     * @param {Object} req - Express request object containing the payment_id, status, and merchant_order_id in the request query.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing payment information from Mercadopago or an error message.
     */
    async feedback(req, res = response) {
        const { payment_id, status, merchant_order_id } = req.query;
        try {
            res.status(200).json({
                Payment: payment_id,
                Status: status,
                MerchantOrder: merchant_order_id
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message 
            });
        }
    };
}

export {
    MercadopagoController
};