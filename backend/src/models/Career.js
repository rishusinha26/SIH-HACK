import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stream: { type: String, required: true },
    description: String,
    tags: [{ type: String }],
    requiredSkills: [{ type: String }],
    recommendedIf: {
      logicalGte: { type: Number, default: 0 },
      creativeGte: { type: Number, default: 0 },
      quantitativeGte: { type: Number, default: 0 },
      socialGte: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Career', careerSchema);



