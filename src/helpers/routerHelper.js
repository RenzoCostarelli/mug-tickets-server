/**
 * Class representing the setup of routes for the Express application.
 */
import 'dotenv/config'
import { router as userRouter } from '../routes/userRoutes.js';
import { router as adminRouter } from '../routes/adminRoutes.js';
import { router as ticketRouter } from '../routes/ticketRoutes.js';
import { router as ticketTypeRouter } from '../routes/ticketTypeRoutes.js';
import { router as eventRoutes } from '../routes/eventRoutes.js';
import { router as orderRoutes } from '../routes/orderRoutes.js';
import { router as logInRoutes } from '../routes/logInRoutes.js';
import { router as adminLogInRoutes } from '../routes/adminLogInRoutes.js';
import { router as uploadImagesRoutes } from '../routes/uploadImagesRoutes.js';
import { router as mercadopagoRoutes } from '../routes/mercadopagoRoutes.js';

class Routes {
  /**
   * Create a Routes instance.
   * @param {Object} app - The Express application instance.
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * Sets up the routes for the Express application by registering various route handlers.
   * Each route handler is associated with a specific route path.
   */

  setupRoutes() {
    //API key Authorization
    /*this.app.use((req, res, next) => {
        const apiKey = req.get('API-Key')
        if (!apiKey || apiKey !== process.env.API_KEY) {
            res.status(401).json({
                ok: false,
                error: 'Unauthorized'
            });
        } else {
            next();
        }
    });*/
    

    // User Routes
    this.app.use('/api/users', userRouter);

    // Admin Routes
    this.app.use('/api/admins', adminRouter);

    // Ticket Routes
    this.app.use('/api/tickets', ticketRouter);

    // Ticket type Routes
    this.app.use('/api/ticketTypes', ticketTypeRouter);

    // Order type Routes
    this.app.use('/api/orders', orderRoutes);

    // Event Routes
    this.app.use('/api/events', eventRoutes);

    // User Login Routes
    this.app.use('/api/login', logInRoutes);

    // Admin Login Routes
    this.app.use('/api/panel/login', adminLogInRoutes);

    // Upload Images Routes
    this.app.use('/api/upload', uploadImagesRoutes);

    // MercadoPago Checkout Routes
    this.app.use('/api/checkout', mercadopagoRoutes);
  }
}

export {
  Routes
};