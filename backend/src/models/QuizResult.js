import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    scores: {
      logical: { type: Number, default: 0 },
      verbal: { type: Number, default: 0 },
      quantitative: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
    },
    recommendedStreams: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('QuizResult', quizResultSchema);



