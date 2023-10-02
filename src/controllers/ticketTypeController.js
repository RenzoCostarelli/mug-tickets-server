import { response } from 'express';
import { TicketType } from '../models/ticketTypeModel.js';
import { Event } from '../models/eventModel.js';

/**
 * Controller class for handling event-related operations.
 */
class TicketTypeController {    
    constructor(){}

    /**
     * Get all ticketTypes from the database.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of ticketTypes or an error message.
     */
    async getAll(req, res = response) {
      try {
        const ticketTypes = await TicketType.find({/*
          date: {
              $gt: new Date()
          }
      }).sort({ date: 1*/ })/*.populate('purchasedTicketsList');*/

        res.status(200).json({
          ok: true,
          ticketTypes
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }

    /**
     * Filter ticketTypes based on the provided query parameters.
     *
     * @param {Object} req - Express request object containing query parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing an array of filtered ticketTypes or an error message.
     */
    async filter(req, res = response) {
      try {
        const ticketTypes = await TicketType.find(req.query);
        if (ticketTypes.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No ticketTypes matched your search'
            });
        }
        
        res.status(200).json({
          ok: true,
          ticketTypes
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Create a new ticketTypes with the provided data.
     *
     * @param {Object} req - Express request object containing the ticketTypes data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the newly created ticketTypes details or an error message.
     */
    async create(req, res = response) {
      try {
        const {
            eventId,
            price,
            date,
            type,
            ticketsAvailableOnline,
            ticketPurchaseDeadline         
        } = req.body;

        const newTicketType = new TicketType({
            eventId,
            price,
            date,
            type,
            ticketsAvailableOnline,
            ticketPurchaseDeadline      
        });

        if (!eventId) {
          return res.status(404).json({ 
            ok: false, 
            error: `Missing creator Id ${eventId}.` 
          });
        }

        const event = await Event.findById(eventId);
        const savedNewticketType = await newTicketType.save();
        event.ticketsTypeList = event.ticketsTypeList.concat(savedNewticketType._id);

        await event.save();
        
        res.status(200).json({
          ok: true,
          newTicketType
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Get an ticketTypes by its ID.
     *
     * @param {Object} req - Express request object containing the ticketTypes ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the ticketTypes details or an error message if not found.
     */
    async get(req, res = response) {      
      try {
        const { id } = req.params;
        const ticketType = await TicketType.findById(id)/*.populate('purchasedTicketsList')*/;
        if (!ticketType) {
          return res.status(404).json({ 
            ok: false, 
            error: `Event with id ${id} not found.` 
          });
        }

        res.status(200).json({
          ok: true,
          ticketType
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
      }
    }
  
    /**
     * Update an ticketTypes's information by its ID.
     *
     * @param {Object} req - Express request object containing the ticketTypes ID in the request parameters and updated data in the request body.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing the updated ticketTypes details or an error message if not found.
     */
    async update(req, res = response) {
      const { id } = req.params;
      const {
        eventId,
        price,
        date,
        type,
        ticketsAvailableOnline,
        ticketPurchaseDeadline         
    } = req.body;

      try {
        const updatedTicketType = await TicketType.findByIdAndUpdate(id, {
          eventId,
          price,
          date,
          type,
          ticketsAvailableOnline,
          ticketPurchaseDeadline         
        }, { new: true });

        if (!updatedTicketType) {
          return res.status(404).json({ 
            ok: false, 
            error: `Ticket type with id ${id} not found.` 
          });
        }

        res.status(200).json({
          ok: true,
          updatedTicketType
        });        
      } catch (err) {
        res.status(500).json({ 
          ok: false, error: 
          err.message 
        });
      }
    }

    /**
     * Delete an ticketTypes by its ID.
     *
     * @param {Object} req - Express request object containing the ticketTypes ID in the request parameters.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure of the delete operation.
     */
    async delete(req, res = response) {
      const { id } = req.params;

      try {
        const deletedTicketType = await TicketType.findByIdAndRemove(id, { new: true });
        if (!deletedTicketType) {
          return res.status(404).json({ 
            ok: false, 
            error: `TicketType with id ${id} not found.` 
          });
        }

        res.status(200).json({
          ok: true,
          message: `TicketType with id ${ id } was deleted.`
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
  TicketTypeController 
};