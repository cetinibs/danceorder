import mongoose from 'mongoose';

const bodyFatMeasurementSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  value: { type: Number, required: true },
  notes: String
}, { _id: false });

const healthInfoSchema = new mongoose.Schema({
  status: { type: String, default: 'Sağlıklı' },
  conditions: [String],
  notes: String,
  bodyFatMeasurements: [bodyFatMeasurementSchema]
}, { _id: false });

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  emergencyContact: {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    relationship: String
  },
  healthInfo: healthInfoSchema,
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  packages: [{
    type: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    totalHours: { type: Number, required: true },
    remainingHours: { type: Number, required: true },
    price: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    status: { type: String, default: 'active' }
  }],
  deactivatedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema); 