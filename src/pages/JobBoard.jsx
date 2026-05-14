import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getListings } from '../services/api';

// Reusing styles from Home.css for consistency, but we can isolate later if needed
import './Home.css'; 

export default function JobBoard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await getListings();
      setListings(response.data);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job) => {
    navigate('/apply', { state: { job } });
  };

  return (
    <>
      <Navbar />

      <main className="home" style={{ minHeight: 'calc(100vh - 100px)', paddingTop: '40px' }}>
        <section className="job-listings" style={{ background: 'transparent', padding: '0 24px' }}>
          <div className="section-header">
            <h2>📋 Available Jobs</h2>
            <p>Find your next opportunity. Click apply to start.</p>
          </div>

          <div className="jobs-container">
            {/* Job 1 - Washer */}
            <div className="job-card-glass">
              <img
                src="/images/carWasher.png"
                alt="Car Washer"
                className="job-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x200/2563EB/white?text=carWasher";
                }}
              />
              <div className="job-content">
                <h3>Car Washer</h3>
                <p>Entry-level position. No experience needed. Full training provided. Perfect for beginners starting their career.</p>
                <div className="job-badge">🎯 15+ openings</div>
                <button className="apply-job-btn" onClick={() => handleApplyClick({_id: '507f1f77bcf86cd799439011', title: 'Car Washer', description: 'Entry-level position. No experience needed. Full training provided. Perfect for beginners starting their career.', salary: '15+ openings'})}>Apply Now →</button>
              </div>
            </div>

            {/* Job 2 - Accountant */}
            <div className="job-card-glass">
              <img
                src="/images/accountant.png"
                alt="Accountant"
                className="job-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x200/F59E0B/white?text=accountant";
                }}
              />
              <div className="job-content">
                <h3>Accountant</h3>
                <p>Manage financial records, payroll, and bookkeeping. QuickBooks experience preferred. CPA not required.</p>
                <div className="job-badge">💰 $45-60k/year</div>
                <button className="apply-job-btn" onClick={() => handleApplyClick({_id: '507f1f77bcf86cd799439012', title: 'Accountant', description: 'Manage financial records, payroll, and bookkeeping. QuickBooks experience preferred. CPA not required.', salary: '$45-60k/year'})}>Apply Now →</button>
              </div>
            </div>

            {/* Job 3 - Manager */}
            <div className="job-card-glass">
              <img
                src="/images/manager.png"
                alt="Operations Manager"
                className="job-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x200/F59E0B/white?text=manager";
                }}
              />
              <div className="job-content">
                <h3>Operations Manager</h3>
                <p>Lead daily operations, manage staff, ensure customer satisfaction. 2+ years experience preferred.</p>
                <div className="job-badge">👔 $55-75k/year</div>
                <button className="apply-job-btn" onClick={() => handleApplyClick({_id: '507f1f77bcf86cd799439013', title: 'Operations Manager', description: 'Lead daily operations, manage staff, ensure customer satisfaction. 2+ years experience preferred.', salary: '$55-75k/year'})}>Apply Now →</button>
              </div>
            </div>

            {/* Job 4 - Office Cleaner */}
            <div className="job-card-glass">
              <img
                src="/images/job-cleaner.png"
                alt="Office Cleaner"
                className="job-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x200/8B5CF6/white?text=Office+Cleaner";
                }}
              />
              <div className="job-content">
                <h3>Office Cleaner</h3>
                <p>Maintain cleanliness of office and facility areas. Flexible hours. Morning and evening shifts available.</p>
                <div className="job-badge">🧹 $14-18/hr</div>
                <button className="apply-job-btn" onClick={() => handleApplyClick({_id: '507f1f77bcf86cd799439014', title: 'Office Cleaner', description: 'Maintain cleanliness of office and facility areas. Flexible hours. Morning and evening shifts available.', salary: '$14-18/hr'})}>Apply Now →</button>
              </div>
            </div>

            {/* Job 5 - Drivers */}
            <div className="job-card-glass">
              <img
                src="/images/job-driver.png"
                alt="Driver/Valet"
                className="job-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x200/EF4444/white?text=Driver";
                }}
              />
              <div className="job-content">
                <h3>Driver / Valet</h3>
                <p>Move customer vehicles safely. Valid driver's license required. Good driving record essential.</p>
                <div className="job-badge">🚗 $16-22/hr + tips</div>
                <button className="apply-job-btn" onClick={() => handleApplyClick({_id: '507f1f77bcf86cd799439015', title: 'Driver / Valet', description: 'Move customer vehicles safely. Valid driver\'s license required. Good driving record essential.', salary: '$16-22/hr + tips'})}>Apply Now →</button>
              </div>
            </div>
            
            {/* Dynamic Listings from DB */}
            {!loading && listings.map(job => (
              <div key={job._id} className="job-card-glass">
                <img
                  src={`https://placehold.co/400x200/2563EB/white?text=${encodeURIComponent(job.title)}`}
                  alt={job.title}
                  className="job-image"
                />
                <div className="job-content">
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  {job.salary && <div className="job-badge">✨ {job.salary}</div>}
                  <button className="apply-job-btn" onClick={() => handleApplyClick(job)}>Apply Now →</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
