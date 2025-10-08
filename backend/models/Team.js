const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  role: String,
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  members: [memberSchema],
  neededRoles: { type: [String], default: [] }, // new field
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'recruiting'], default: 'active' },
  hackathon: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
