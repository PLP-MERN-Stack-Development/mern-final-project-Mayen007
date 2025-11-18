const express = require('express');
const { body, validationResult } = require('express-validator');
const Registration = require('../models/Registration');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Register for event
router.post('/', auth, [
  body('eventId').isMongoId().withMessage('Valid event ID required'),
  body('ticketType').isIn(['standard', 'vip']).withMessage('Invalid ticket type'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { eventId, ticketType, quantity } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    // Check capacity
    const existingRegs = await Registration.find({ event: eventId, status: 'confirmed' });
    const totalRegistered = existingRegs.reduce((sum, reg) => sum + reg.quantity, 0);
    if (totalRegistered + quantity > event.capacity) return res.status(400).json({ error: 'Not enough spots' });
    const totalPrice = quantity * (ticketType === 'vip' ? event.price * 1.5 : event.price);
    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      ticketType,
      quantity,
      totalPrice
    });
    await registration.save();
    // Generate tickets
    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = new Ticket({
        registration: registration._id,
        ticketNumber: `TICKET-${registration._id}-${i}`
      });
      await ticket.save();
      tickets.push(ticket);
    }
    // Real-time update
    const io = req.app.get('io');
    io.emit('registration', { eventId, message: 'New registration added' });
    res.status(201).json({ registration, tickets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's registrations
router.get('/', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).populate('event', 'title date location');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;