const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
  ticketNumber: { type: String, required: true, unique: true },
  qrCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);