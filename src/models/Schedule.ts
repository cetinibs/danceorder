import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  notes: { type: String },
  isMakeup: { type: Boolean, default: false }
});

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema); 