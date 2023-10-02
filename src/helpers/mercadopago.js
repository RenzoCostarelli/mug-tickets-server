import mercadopago from 'mercadopago';
import 'dotenv/config'

/**
 * Creates a transaction using MercadoPago API.
 * @param {Object} options - An object containing options for the transaction.
 * @param {string} options.description - The description of the transaction.
 * @param {number} options.price - The price of the item in the transaction.
 * @param {number} options.quantity - The quantity of the item in the transaction.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the ID of the created transaction if successful,
 *                               or an object with `ok` as false and an error message if there is an issue with the transaction.
 */
const createTransaction = async (options = {}) => {
    console.log(options)
    try{
        const { description, price, quantity } = options;
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
            return {
                ok: true,
                id: response.body.id
            };
        }

        return { 
            ok: false, 
            error: 'Algo salió mal con MP' 
        };

    } catch(err) {
        return { 
            ok: false, 
            error: err.message 
        };
    }
};

export {
    createTransaction
};