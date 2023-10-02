import mongoose from 'mongoose';
/**
 * Mongoose schema for the 'user' collection.
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dni: {
    type: Number,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  purchasedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
});

/**
 * Method to convert the Mongoose document to a JSON object.
 * Removes '__v', '_id', and 'password' fields from the returned JSON object.
 * Adds 'uid' field using the '_id' field for the returned JSON object.
 */
userSchema.method('toJSON', function() {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

/**
 * Mongoose model for the 'User' collection based on the 'userSchema'.
 */
const User = mongoose.model('User', userSchema);
export {
  User
};