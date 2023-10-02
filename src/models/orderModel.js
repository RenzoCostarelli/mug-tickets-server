import mongoose from 'mongoose';

/**
 * Mongoose schema for the 'Order' collection.
 */
const orderSchema = new mongoose.Schema({  
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    quantity:{
        type: Number,
        min: 1,
        default: 1
    },
    ticketType: {
        price:{
            type: Number,
            min: 0,
            default: 0
        },
        date: {
            type: Date,
            required: false,
        },
        type: {
            type: String,
            required: false
        }
    },
    status: {
        type: String,
        default: 'Pending'
    },
    expirationDate: {
        type: Date,
        required: false,
    },
    purchaser: {
        purchaserFirstName: {
            type: String,
            required: false
        }, 
        purchaserLastName: {
            type: String,
            required: false
        }, 
        purchaserDni: {
            type: String,
            required: false
        },
        purchaserEmail: {
            type: String,
            required: false
        }
    }
});

const Order = mongoose.model('Order', orderSchema);
export {
  Order 
};