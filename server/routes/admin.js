const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const adminAuth = require('../middleware/adminAuth');

// Get all pending applications (awaiting approval at any stage)
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const pendingJobs = await JobApplication.find({
      approvalStatus: 'pending'
    }).populate('userId', 'name email').populate('jobListingId');
    res.json(pendingJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all applications for stats
router.get('/all', adminAuth, async (req, res) => {
  try {
    const allJobs = await JobApplication.find()
      .populate('userId', 'name email')
      .populate('jobListingId');
    res.json(allJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve application — move from applied → interview
router.put('/approve/:id', adminAuth, async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(
      req.params.id,
      {
        stage: 'interview',
        approvalStatus: 'approved',
        adminNotes: req.body.notes,
        updatedAt: Date.now()
      },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reject application
router.put('/reject/:id', adminAuth, async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(
      req.params.id,
      {
        stage: 'rejected',
        approvalStatus: 'rejected',
        adminNotes: req.body.notes,
        updatedAt: Date.now()
      },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approve interview stage — move from interview → offer
router.put('/approve-interview/:id', adminAuth, async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(
      req.params.id,
      {
        stage: 'offer',
        approvalStatus: 'approved',
        adminNotes: req.body.notes,
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
