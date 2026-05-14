const express = require('express');
const router = express.Router();
const JobListing = require('../models/JobListing');
const adminAuth = require('../middleware/adminAuth');

// Get all active job listings (public)
router.get('/', async (req, res) => {
  try {
    const listings = await JobListing.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all job listings (including inactive)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const listings = await JobListing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create new job listing
router.post('/', adminAuth, async (req, res) => {
  try {
    const listing = new JobListing(req.body);
    const savedListing = await listing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update job listing
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const listing = await JobListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete job listing
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await JobListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
