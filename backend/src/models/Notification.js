import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['admission', 'scholarship', 'exam'], required: true },
    deadline: { type: Date },
    url: { type: String },
    stream: { type: String },
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);



