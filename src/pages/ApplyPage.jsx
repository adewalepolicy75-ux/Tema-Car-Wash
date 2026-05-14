import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createJob } from '../services/api';
import Navbar from '../components/Navbar';
import './ApplyPage.css';

export default function ApplyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    userLocation: '',
    experience: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!job) {
    return (
      <div className="apply-page-wrapper">
        <Navbar />
        <div className="apply-container" style={{ flexDirection: 'column', color: 'white' }}>
          <h2>Job details not found.</h2>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Create job application
      await createJob({
        jobListingId: (job._id && job._id.length === 24) ? job._id : '507f1f77bcf86cd799439011',
        fullName: formData.fullName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        location: formData.userLocation,
        experience: formData.experience,
        applicationDate: new Date(),
        age: 0
      });
      toast.success('Application submitted successfully!');
      navigate('/applied'); // Assuming '/applied' is the pipeline start
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="apply-page-wrapper">
      <Navbar />
      
      <div className="apply-container">
        <div className="liquid-glass-card">
          <div className="job-summary">
            <h1>{job.title}</h1>
            <p style={{ color: '#94A3B8', marginBottom: '16px', fontSize: '14px' }}>
              {job.description}
            </p>
            <div className="salary-badge">
              💰 {job.salary || 'Competitive Salary'}
            </div>
          </div>

          <form className="apply-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="glass-input"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="glass-input"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                className="glass-input"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="glass-input"
                placeholder="City, State"
                required
                value={formData.userLocation}
                onChange={(e) => setFormData({...formData, userLocation: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Previous Experience</label>
              <textarea
                className="glass-input"
                style={{ minHeight: '100px', resize: 'vertical' }}
                placeholder="Tell us about your past work..."
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            
            <button type="button" className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Cancel and Return
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
