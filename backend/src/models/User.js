import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v);
        },
        message: 'Email must be a valid Gmail address (@gmail.com)'
      }
    },
    passwordHash: { type: String, required: true },
    gradeLevel: { type: String },
    interests: [{ type: String }],
    recoveryEmail: { 
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: 'Recovery email must be a valid email address'
      }
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s\-\(\)]{10,15}$/.test(v);
        },
        message: 'Phone number must be 10-15 digits with optional country code'
      }
    },
    location: {
      city: String,
      state: String,
      lat: Number,
      lng: Number,
    },
    recommendations: {
      streams: [{ type: String }],
      careers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Career' }],
      colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);



