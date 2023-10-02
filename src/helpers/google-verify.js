import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config'
const client = new OAuth2Client(process.env.GOOGLE_SECRET_ID);

/**
 * Verifies the authenticity of a Google ID token.
 * @param {string} token - The Google ID token to be verified.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing user information if the token is valid,
 *                               or an object with `ok` as false and an error message if there is an issue with verification.
 */
const googleVerify = async (token) => {
  try{
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  } catch(err){
    return {
      ok: false,
      error: err.message
    }
  }
}

export {
    googleVerify
};