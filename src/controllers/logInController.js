import { response } from 'express';
import bcryptjs from 'bcryptjs';

import { User } from '../models/userModel.js';
import { generateJWT } from '../config/authentication.js';
import { googleVerify } from '../helpers/google-verify.js';

/**
 * Controller class for handling user login-related operations.
 */
class LogInController {    
    constructor(){}

    /**
     * Log in a user with the provided email and password.
     *
     * @param {Object} req - Express request object containing the user's email and password in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing a JWT token if login is successful, or an error message.
     */
    async login(req, res = response) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Email no válido'
                });
            }

            const validPassword = bcryptjs.compareSync(password, user.password);
            if(!validPassword){
                return res.status(400).json({
                    ok: false,
                    msg: 'Pass no válido'
                });
            }

            const token = await generateJWT(user._id);
            const { firstName, image } = user;
            res.status(200).json({
                ok: true,
                firstName,
                email,
                image,
                token
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message 
            });
        }
    }

    /**
     * Sign in a user with Google OAuth2 token.
     *
     * @param {Object} req - Express request object containing the Google OAuth2 token in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing user information and a new JWT token if sign-in is successful, or an error message.
     */
    async googleSignIn(req, res = response) {
        try {
            const { token } = req.body;
            const { email, picture, name, family_name, given_name } = await googleVerify(token);
            
            const userDB = await User.findOne({ email });
            let newUser;
            if(!userDB) {
                newUser = new User({
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    dni: 0,
                    password: '@@@',
                    image: picture,
                    google: true
                })
            } else {
                newUser = userDB;
                newUser.google = true;
            }

            await newUser.save();
            const newToken = await generateJWT(newUser.id);

            res.status(200).json({
                ok: true,
                name,
                email,
                picture,
                newToken
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message 
            });
        } 
    }
}

export {
    LogInController
};