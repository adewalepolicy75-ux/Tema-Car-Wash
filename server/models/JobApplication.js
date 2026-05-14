const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  experience: {
    type: String,
    required: false
  },
  salary: String,
  applicationDate: Date,
  deadline: Date,
  notes: String,
  stage: { 
    type: String, 
    enum: ['applied', 'pending_approval', 'interview', 'pending_interview_approval', 'offer', 'rejected'],
    default: 'applied'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: String,
  quizScore: {
    type: Number,
    default: 0
  },
  quizPassed: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
