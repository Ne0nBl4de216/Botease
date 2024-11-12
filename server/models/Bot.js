import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    online: Boolean,
    dnd: Boolean,
    streaming: Boolean,
    invisible: Boolean
  },
  commands: [{
    name: String,
    enabled: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Bot = mongoose.model('Bot', botSchema);