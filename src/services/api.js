import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (name, email, password) => 
  api.post('/auth/register', { name, email, password });

export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const getJobs = () => api.get('/jobs');
export const createJob = (jobData) => api.post('/jobs', jobData);
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const submitQuiz = (id, score) => api.put(`/jobs/submit-quiz/${id}`, { score });

export const getPendingJobs = () => api.get('/admin/pending');
export const getAllApplications = () => api.get('/admin/all');
export const approveJob = (id, notes) => api.put(`/admin/approve/${id}`, { notes });
export const rejectJob = (id, notes) => api.put(`/admin/reject/${id}`, { notes });
export const approveInterview = (id, notes) => api.put(`/admin/approve-interview/${id}`, { notes });

// Listings
export const getListings = () => api.get('/listings');
export const getAllListings = () => api.get('/listings/all');
export const createListing = (listingData) => api.post('/listings', listingData);
export const updateListing = (id, listingData) => api.put(`/listings/${id}`, listingData);
export const deleteListing = (id) => api.delete(`/listings/${id}`);

export default api;
