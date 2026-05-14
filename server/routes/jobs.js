const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const auth = require('../middleware/auth');

// Get all applications for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.userId }).populate('jobListingId');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new job application
router.post('/', auth, async (req, res) => {
  try {
    const job = new JobApplication({
      ...req.body,
      userId: req.userId,
      stage: 'applied',
      approvalStatus: 'pending'
    });
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update job application
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job application
router.delete('/:id', auth, async (req, res) => {
  try {
    await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit interview quiz result
router.put('/submit-quiz/:id', auth, async (req, res) => {
  try {
    const { score } = req.body;
    const passed = score >= 75;
    const newStage = passed ? 'offer' : 'rejected';
    
    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        quizScore: score,
        quizPassed: passed,
        stage: newStage,
        updatedAt: Date.now()
      },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
