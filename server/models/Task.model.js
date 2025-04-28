import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  isIssue: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
