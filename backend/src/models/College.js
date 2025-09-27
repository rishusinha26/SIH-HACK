import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: String,
    state: String,
    location: { lat: Number, lng: Number },
    streams: [{ type: String }],
    courses: [{ type: String }],
    website: String,
  },
  { timestamps: true }
);

export default mongoose.model('College', collegeSchema);



