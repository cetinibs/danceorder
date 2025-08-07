import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  packages: [{
    type: { type: String, enum: ['individual', 'duet', 'group'] },
    hours: { type: Number },
    price: { type: Number },
    details: { type: String }
  }]
});

export default mongoose.models.Service || mongoose.model('Service', serviceSchema); 