import { response } from "express";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { Event } from "../models/eventModel.js";
import { TicketController } from "./ticketController.js";
const ticketController = new TicketController();
/**
 * Controller class for handling ticket-related operations.
 */
class OrderController {
  constructor() {  }

  /**
   * Get all order from the database and populate their associated events.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing an array of order or an error message.
   */
  async getAll(req, res = response) {
    try {
      const orders = await Order.find({}).populate("event", {
        eventId: 1,
        eventType: 1,
        ticketPurchaseDeadline: 1,
        hasLimitedPlaces: 1,
        description: 1,
        title: 1,
        address: 1,
        date: 1,
      });

      res.status(200).json({
        ok: true,
        orders,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Filter order based on the provided query parameters.
   *
   * @param {Object} req - Express request object containing query parameters.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing an array of filtered order or an error message.
   */
  async filter(req, res = response) {
    try {
      const orders = await Order.find(req.query);

      if (orders.length < 1) {
        return res.status(404).json({
          ok: false,
          error: "No orders matched your search",
        });
      }

      res.status(200).json({
        ok: true,
        orders,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Create new order with the provided data.
   *
   * @param {Object} req - Express request object containing the ticket data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the newly created ticket details or an error message.
   */
  async create(req, res = response) {
    try {
      const {
        eventId,
        quantity,
        ticketType: { price, date, type },
        status,
        expirationDate,
      } = req.body;

      if(!eventId) {
        return res.status(404).json({
          ok: false,
          message: 'Event id is required',
        });
      }

      const newOrder = new Order({
        event: eventId,
        quantity,
        ticketType: {
          price,
          date,
          type,
        },
        status,
        expirationDate,
      });

      const savedNewOrder = await newOrder.save();
      await newOrder.populate("event", {
        eventId: 1,
        eventType: 1,
        ticketPurchaseDeadline: 1,
        hasLimitedPlaces: 1,
        title: 1,
        address: 1,
        date: 1,
        description: 1,
        image: 1,
        ticketsAvailableOnline: 1,
      });

      res.status(200).json({
        ok: true,
        savedNewOrder,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }
  /**
   * Get a ticket by its ID and populate its associated event.
   *
   * @param {Object} req - Express request object containing the ticket ID in the request parameters.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the ticket details or an error message if not found.
   */
  async get(req, res = response) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate('event', {
        eventId: 1,
        eventType: 1,
        ticketPurchaseDeadline: 1,
        hasLimitedPlaces: 1,
        description: 1,
        title: 1,
        image: 1,
        address: 1,
        date: 1,
      });

      if (!order) {
        return res.status(404).json({
          ok: false,
          error: `Order with id ${id} not found.`,
        });
      }

      res.status(200).json({
        ok: true,
        order,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Update a order's information by its ID.
   *
   * @param {Object} req - Express request object containing the order ID in the request body and updated data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the updated order details or an error message if not found.
   */
  async update(req, res = response) {  
    try {   
      const { id } = req.params;
      const {
        eventId,
        quantity,
        status,
        expirationDate,
        purchaser: { 
          purchaserFirstName, 
          purchaserLastName, 
          purchaserDni,
          purchaserEmail
        }
      } = req.body;
      
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          eventId,
          quantity,
          status,
          expirationDate,
          purchaser: { 
            purchaserFirstName, 
            purchaserLastName, 
            purchaserDni,
            purchaserEmail
          }
        }
      );

      res.status(200).json({
        ok: true,
        updatedOrder,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Update a order's information by its ID.
   *
   * @param {Object} req - Express request object containing the order ID in the request body and updated data in the request body.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response containing the updated order details or an error message if not found.
   */
  async updateStatus(req, res = response) {  
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(id, { status });
      
      if( status.toLowerCase() === 'aproved' && updatedOrder.status.toLowerCase() !== 'aproved') {        
          const { event, purchaser, quantity } = updatedOrder;
          const tickets = [];
          
          for (let i = 0; i < quantity; i++) {
            tickets.push({
              orderId: id,
              event,
              purchaser: { 
                  purchaserFirstName: purchaser?.purchaserFirstName, 
                  purchaserLastName: purchaser?.purchaserLastName, 
                  purchaserDni: purchaser?.purchaserDni,
                  purchaserEmail: purchaser?.purchaserEmail
                  },
              attendee: { 
                  attendeeFirstName: purchaser?.purchaserFirstName,
                  attendeeLastName: purchaser?.purchaserLastName, 
                  attendeeDni: purchaser?.purchaserDni,
              }
            });
          }
          
          await ticketController.createTickets( tickets );

          res.status(200).json({
            ok: true,
            updatedOrder,
          });
      } else {
        console.log('ya esta aprobada la orden')
        res.status(404).json({
          ok: false,
          message: 'Order not found',
        });
      }
      
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

  /**
   * Delete a ticket by its ID.
   *
   * @param {Object} req - Express request object containing the ticket ID in the request parameters.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response indicating success or failure of the delete operation.
   */
  async delete(req, res = response) {
    const { id } = req.params;

    try {
      await Order.findByIdAndRemove(id, { new: true });

      res.status(200).json({
        ok: true,
        message: `Order with id ${id} was deleted.`,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
  }

}

export { OrderController };
