import mongoose from 'mongoose';
/**
 * Mongoose schema for the 'ticket' collection.
 */
const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  purchaser: {
    purchaserFirstName: {
      type: String,
      required: true
    },
    purchaserLastName: {
      type: String,
      required: true
    },
    purchaserId: {
      type: String,
      required: false
    },
    purchaserDni: {
      type: Number,
      required: true
    },
    purchaserEmail: {
      type: String,
      trim: true
    }
  },
  attendee: {
    attendeeFirstName: {
      type: String,
      required: true
    },
    attendeeLastName: {
      type: String,
      required: true
    },
    attendeeDni: {
      type: Number,
      required: true
    }
  },
  validated: {
    type: Boolean,
    default: false
  },
  purchased: {
    type: Boolean,
    default: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },  
  validationDate: {
    type: Date,
    default: null
  },
  qrCode: {
    type: String,
    //required: true
  },
  ticketNumber: {
    type: Number,
    required: true
  }
});

/**
 * Method to convert the Mongoose document to a JSON object.
 * Removes '__v' and '_id' fields from the returned JSON object.
 * Adds 'ticketId' field using the '_id' field for the returned JSON object.
 */
ticketSchema.method('toJSON', function() {
  const { __v, _id, ... object } = this.toObject();
  object.ticketId = _id;
  object.ticketNumber = (object.ticketNumber).toLocaleString('en-US', {
    minimumIntegerDigits: 7, 
    useGrouping:false
  })
  return object;
});

/**
 * Mongoose model for the 'Ticket' collection based on the 'ticketSchema'.
 */
const Ticket = mongoose.model('Ticket', ticketSchema);
export {
  Ticket
};