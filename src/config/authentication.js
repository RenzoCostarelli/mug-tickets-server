import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { User } from '../models/userModel.js';
/**
 * Middleware function to authenticate incoming requests using JSON Web Tokens (JWT).
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next function to continue to the next middleware/route handler.
 * @throws {Error} If user is not found or token is invalid, an error is thrown and an unauthorized response is sent.
 */
const auth = async (req, res, next) => {
  try {
    const { header } = req;
    const token = header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findOne({ 
      _id: decoded._id, 
      'tokens.token': token
    });

    if (!user) {
      res.status(404).json({ 
        ok: false, 
        error: `Event with id ${id} not found.` 
      });
      throw new Error('User not found or token invalid');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

/**
 * Generates a JSON Web Token (JWT) with the given user ID (uid) as the payload.
 *
 * @param {string} uid - User ID to be included in the JWT payload.
 * @returns {Promise<string>} A Promise that resolves to the generated JWT.
 * @throws {Error} If there's an error during JWT generation, it is logged, and the Promise is rejected.
 */
const generateJWT = ( uid ) => new Promise((resolve, reject) => {
  const payload = {
    uid
  };
  jwt.sign( payload, process.env.JWT_SECRET, {
    expiresIn: '12h'
  }, (err, token) => {  
    if(err) {
      console.log(err);
      reject('Error generating JWT');
    } else {
      resolve(token);
    }  
  });
});


export {
  auth,
  generateJWT
};