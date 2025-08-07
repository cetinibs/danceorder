import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  colorCode: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema); 