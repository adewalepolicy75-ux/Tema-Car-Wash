import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Plus, Trash2, PieChart, Users, UserCheck, UserX } from 'lucide-react';
import { getPendingJobs, approveJob, rejectJob, getAllListings, createListing, deleteListing, getAllApplications } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'applications' or 'listings'
  
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Listing Form State
  const [newListing, setNewListing] = useState({ title: '', description: '', salary: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      toast.error('Admin access only');
      navigate('/applied');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, listingsRes, allJobsRes] = await Promise.all([
        getPendingJobs(),
        getAllListings(),
        getAllApplications()
      ]);
      setPendingJobs(jobsRes.data);
      setListings(listingsRes.data);
      setAllJobs(allJobsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = allJobs.length;
    const qualified = allJobs.filter(j => j.stage === 'interview' || j.stage === 'offer').length;
    const rejected = allJobs.filter(j => j.stage === 'rejected').length;
    const pending = allJobs.filter(j => j.approvalStatus === 'pending').length;

    return { total, qualified, rejected, pending };
  };

  const stats = getStats();

  const handleApprove = async (jobId) => {
    try {
      await approveJob(jobId, '');
      toast.success('Application approved!');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (jobId) => {
    try {
      await rejectJob(jobId, '');
      toast.error('Application rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!newListing.title || !newListing.description) {
      toast.error('Title and description are required');
      return;
    }
    setCreating(true);
    try {
      await createListing(newListing);
      toast.success('Listing created successfully');
      setNewListing({ title: '', description: '', salary: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create listing');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteListing(id);
      toast.success('Listing deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', minHeight: 'calc(100vh - 140px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Admin Dashboard</h1>
            <p style={{ color: '#64748B' }}>Manage applications and job listings</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '6px', borderRadius: '12px' }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', background: activeTab === 'overview' ? 'white' : 'transparent', boxShadow: activeTab === 'overview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: activeTab === 'overview' ? '#0F172A' : '#64748B' }}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', background: activeTab === 'applications' ? 'white' : 'transparent', boxShadow: activeTab === 'applications' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: activeTab === 'applications' ? '#0F172A' : '#64748B' }}
            >
              Pending ({pendingJobs.length})
            </button>
            <button 
              onClick={() => setActiveTab('listings')}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', background: activeTab === 'listings' ? 'white' : 'transparent', boxShadow: activeTab === 'listings' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: activeTab === 'listings' ? '#0F172A' : '#64748B' }}
            >
              Manage Listings
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: '#DBEAFE', color: '#2563EB', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={28} style={{ margin: 'auto' }} />
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Total Applied</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A' }}>{stats.total}</div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: '#D1FAE5', color: '#059669', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={28} style={{ margin: 'auto' }} />
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Qualified</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A' }}>{stats.qualified}</div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: '#FEE2E2', color: '#DC2626', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserX size={28} style={{ margin: 'auto' }} />
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Rejected</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A' }}>{stats.rejected}</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PieChart size={22} color="#2563EB" /> Application Breakdown
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
                    <span>Qualified Candidates</span>
                    <span>{stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.total > 0 ? (stats.qualified / stats.total) * 100 : 0}%`, height: '100%', background: '#10B981', transition: 'width 1s ease-in-out' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
                    <span>Pending Review</span>
                    <span>{stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%`, height: '100%', background: '#2563EB', transition: 'width 1s ease-in-out' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
                    <span>Rejected</span>
                    <span>{stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%`, height: '100%', background: '#EF4444', transition: 'width 1s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'applications' && (
          <div>
            {pendingJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>No pending applications</div>
            ) : (
              pendingJobs.map(job => (
                <div key={job._id} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{job.jobListingId?.title || 'Unknown Role'}</h3>
                      <span style={{ padding: '4px 10px', background: '#DBEAFE', color: '#1D4ED8', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{job.stage}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                      <div><strong>Applicant:</strong> {job.userId?.name || 'Unknown'}</div>
                      <div><strong>Age:</strong> {job.age}</div>
                    </div>
                    
                    <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                      <strong style={{ display: 'block', marginBottom: '4px', color: '#0F172A' }}>Past Experience:</strong>
                      {job.experience}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                    <button onClick={() => handleApprove(job._id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#22C55E', color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button onClick={() => handleReject(job._id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EF4444', color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Create Listing Form */}
            <div style={{ flex: '1 1 300px', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#2563EB" /> Create New Listing
              </h3>
              <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Job Title</label>
                  <input 
                    type="text" 
                    value={newListing.title}
                    onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                    placeholder="e.g. Senior Detailer"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Salary Range (Optional)</label>
                  <input 
                    type="text" 
                    value={newListing.salary}
                    onChange={(e) => setNewListing({...newListing, salary: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', boxSizing: 'border-box' }}
                    placeholder="e.g. 3,000 - 5,000 GHS"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '6px' }}>Description / Requirements</label>
                  <textarea 
                    value={newListing.description}
                    onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', minHeight: '100px', boxSizing: 'border-box', resize: 'vertical' }}
                    placeholder="Describe the role..."
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={creating}
                  style={{ background: '#2563EB', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: creating ? 'not-allowed' : 'pointer' }}
                >
                  {creating ? 'Creating...' : 'Post Job Listing'}
                </button>
              </form>
            </div>

            {/* Active Listings List */}
            <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', color: '#64748B' }}>No job listings created yet.</div>
              ) : (
                listings.map(listing => (
                  <div key={listing._id} style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'relative' }}>
                    <button 
                      onClick={() => handleDeleteListing(listing._id)}
                      style={{ position: 'absolute', top: '20px', right: '20px', background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Delete Listing"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', paddingRight: '40px' }}>{listing.title}</h4>
                    {listing.salary && <div style={{ fontSize: '13px', color: '#059669', fontWeight: '600', marginBottom: '12px', display: 'inline-block', background: '#D1FAE5', padding: '2px 8px', borderRadius: '12px' }}>{listing.salary}</div>}
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#94A3B8' }}>
                      Posted on {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
