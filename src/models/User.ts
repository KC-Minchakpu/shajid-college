import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'applicant' 
  },
  
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'submitted', 'admitted', 'rejected'],
    required: true
  },
}, { timestamps: true });

// This prevents Mongoose from creating the model twice during hot reloads
const User = models.User || model('User', UserSchema);

export default User;