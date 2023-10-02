import mongoose from 'mongoose';
import { Counter } from './counterModel.js';

/**
 * Mongoose schema for the 'event' collection.
 */
const eventSchema = new mongoose.Schema({  
  creatorId: {
    type: String,
    required: false,
  },
  eventType: {
    type: String,
    required: true,
  },
  ticketsAvailableOnline: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  ticketsPurchased: {
    type: Number,
    default: 0,
    min: 0,
  },
  ticketPurchaseDeadline: {
    type: Date,
    required: false
  },
  hasLimitedPlaces: {
    type: Boolean,
    required: true,
    default: false
  },  
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dates: [{
    date: {
      type: Date,
      required: false
    }
  }],
  image: {
    type: String,
    required: false
  },
  ticketsAvailableOffline: {
    type: String,
    min: 0,
  },
  price:{
    type: Number,
    min: 0,
    default: 0
  },
  purchasedTicketsList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  ticketsTypeList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TicketType'
  }]
});

eventSchema.pre('save', async function(next) {
  const event = this;
  if (!event.isNew) {
    next();
  }
  const count = await Counter.count({});
    if (count === 0) {
      const result = await Counter.create({
        _id: 'entity',
        value: event.ticketsAvailableOnline
      });
      event.ticketsPurchased = result.value;
      next();
    } else {
      const result = Counter.findOneAndUpdate(
        { _id: 'entity' },
        { $inc: { value: 1 } },
        { new: true });
      event.ticketsPurchased = result.value;
      next();
    };
});

/**
 * Mongoose pre-save hook for the 'event' schema.
 * It updates the 'ticketsPurchased' field based on the 'ticketsAvailableOnline' value.
 */
eventSchema.method('toJSON', function() {
  const { __v, _id, ... object } = this.toObject();
  object.eventId = _id;
  return object;
});

/**
 * Method to convert the Mongoose document to a JSON object.
 * Removes '__v' and '_id' fields from the returned JSON object.
 * Adds 'eventId' field using the '_id' field for the returned JSON object.
 */
const Event = mongoose.model('Event', eventSchema);
export {
  Event 
};