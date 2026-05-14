import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getJobs, deleteJob, submitQuiz } from '../services/api';
import './Dashboard.css';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which of these is the most common cause of engine overheating?",
    options: ["Low coolant levels", "Dirty car interior", "Low tire pressure", "Worn out brake pads"],
    correct: 0,
    category: "Car Knowledge"
  },
  {
    id: 2,
    question: "What should you do immediately if you notice a fire outbreak on the wash floor?",
    options: ["Finish washing the current car", "Raise the alarm and evacuate everyone", "Try to hide the fire", "Wait for the manager to arrive"],
    correct: 1,
    category: "Fire Outbreak"
  },
  {
    id: 3,
    question: "In security terms, what is 'unauthorized access'?",
    options: ["A customer entering the lounge", "A staff member entering the site", "An uninvited person entering restricted areas", "A delivery driver arriving"],
    correct: 2,
    category: "Security"
  },
  {
    id: 4,
    question: "Which fire extinguisher type is generally used for electrical fires?",
    options: ["Water", "CO2 or Dry Powder", "Foam", "Wet Chemical"],
    correct: 1,
    category: "Fire Outbreak"
  },
  {
    id: 5,
    question: "What is the primary function of engine oil?",
    options: ["To make the car look shiny", "To lubricate moving parts and reduce friction", "To clean the windshield", "To increase fuel capacity"],
    correct: 1,
    category: "Car Knowledge"
  },
  {
    id: 6,
    question: "What should you do if a customer leaves a valuable item in their car?",
    options: ["Keep it for yourself", "Throw it away", "Secure it and notify the supervisor", "Leave it on the floor"],
    correct: 2,
    category: "Security"
  },
  {
    id: 7,
    question: "How often should you check the fire extinguishers on site?",
    options: ["Never", "Every 5 years", "Regularly (monthly visual checks)", "Only after a fire"],
    correct: 2,
    category: "Fire Outbreak"
  },
  {
    id: 8,
    question: "Which part of the car is responsible for filtering exhaust gases?",
    options: ["Radiator", "Catalytic Converter", "Alternator", "Spark Plug"],
    correct: 1,
    category: "Car Knowledge"
  }
];

const STAGES = [
  {
    key: 'applied',
    route: '/applied',
    label: 'Applied',
    icon: '📝',
    color: '#2563EB',
    stages: ['applied', 'pending_approval', 'interview', 'pending_interview_approval', 'offer'],
    subtitle: "Manage all your active applications here",
  },
  {
    key: 'interview',
    route: '/interviews',
    label: 'Interview',
    icon: '🎯',
    color: '#1E40AF',
    stages: ['interview', 'pending_interview_approval'],
    subtitle: "You've been shortlisted!",
  },
  {
    key: 'offer',
    route: '/offers',
    label: 'Offer',
    icon: '🎉',
    color: '#22C55E',
    stages: ['offer'],
    subtitle: 'Congratulations! 🎊',
  },
  {
    key: 'rejected',
    route: '/rejections',
    label: 'Rejected',
    icon: '❌',
    color: '#EF4444',
    stages: ['rejected'],
    subtitle: 'Keep going — every rejection is a step forward.',
  },
];

function Dashboard({ stage = 'applied' }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs();
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to load applications. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await deleteJob(id);
      setApplications(applications.filter(app => app._id !== id));
      toast.success('Application withdrawn');
    } catch (error) {
      toast.error('Failed to withdraw');
    }
  };

  const isPending = (job) =>
    job.stage === 'pending_approval' || job.stage === 'pending_interview_approval';

  const handleAnswer = (index) => {
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const updatedScore = index === QUIZ_QUESTIONS[currentQuestion].correct ? score + 1 : score;
      const finalPercentage = Math.round((updatedScore / QUIZ_QUESTIONS.length) * 100);
      
      const submit = async () => {
        try {
          setSubmittingQuiz(true);
          await submitQuiz(activeJobId, finalPercentage);
          setQuizFinished(true);
          fetchJobs();
        } catch (error) {
          toast.error('Failed to submit exam result');
        } finally {
          setSubmittingQuiz(false);
        }
      };
      submit();
    }
  };

  const startQuiz = (jobId) => {
    setActiveJobId(jobId);
    setShowQuiz(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
  };

  const currentStage = STAGES.find(s => s.key === stage);
  const filteredApps = applications.filter(app =>
    currentStage.stages.includes(app.stage)
  );
  
  const getCount = (stageConfig) =>
    applications.filter(app => stageConfig.stages.includes(app.stage)).length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your applications...</p>
        </div>
      );
    }

    if (filteredApps.length === 0) {
      return (
        <div className="empty-applications">
          <div className="empty-icon">{currentStage.icon}</div>
          <p>No {currentStage.label.toLowerCase()} applications yet</p>
          {stage === 'applied' && (
            <button onClick={() => navigate('/')}>Browse Available Jobs</button>
          )}
          {stage === 'interview' && (
            <p className="empty-hint">Jobs move here when an admin approves your application.</p>
          )}
          {stage === 'offer' && (
            <p className="empty-hint">Jobs move here when an admin approves your interview stage.</p>
          )}
          {stage === 'rejected' && (
            <p className="empty-hint">Don't give up — keep applying!</p>
          )}
        </div>
      );
    }

    return (
      <div className="dashboard-content-grid" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {stage === 'applied' && (
          <div className="applications-list">
            {filteredApps.map(job => (
              <div
                key={job._id}
                className={`application-item ${isPending(job) ? 'is-pending' : ''}`}
                style={{ borderLeft: `4px solid ${job.stage === 'interview' || job.stage === 'offer' ? '#1E40AF' : '#2563EB'}` }}
              >
                {isPending(job) && (
                  <div className="pending-badge">⏳ Awaiting Admin Review</div>
                )}
                {(job.stage === 'interview' || job.stage === 'offer') && (
                  <div className="approved-badge" style={{ position: 'absolute', top: '12px', right: '120px', background: '#D1FAE5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                    ✅ Approved
                  </div>
                )}
                <div className="app-info">
                  <h3>{job.jobListingId?.title || 'Unknown Role'}</h3>
                  <div className="app-meta" style={{ marginTop: '8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '4px 10px', borderRadius: '12px', fontWeight: '500', color: '#334155' }}>
                      👤 Age: {job.age}
                    </span>
                    {job.applicationDate && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '4px 10px', borderRadius: '12px', fontWeight: '500', color: '#334155' }}>
                        📅 Applied: {new Date(job.applicationDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="app-notes" style={{ marginTop: '12px' }}>
                    <strong style={{ display: 'block', color: '#475569', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Your Experience:</strong>
                    {job.experience}
                  </div>
                  
                  {job.adminNotes && (
                    <div className="admin-notes">💬 Admin note: {job.adminNotes}</div>
                  )}
                </div>
                <div className="app-actions">
                  <button className="delete-btn" onClick={() => handleDelete(job._id)}>Withdraw</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {stage === 'interview' && (
          <div className="prep-guide-container" style={{ animation: 'fadeIn 0.6s ease' }}>
            <div className="prep-guide-card" style={{ background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#1E40AF', marginBottom: '10px' }}>
                  Interview Preparation
                </h3>
                <p style={{ color: '#64748B', fontSize: '18px' }}>Follow these steps to ensure a successful interview at WashTrack.</p>
              </div>

              {filteredApps.map(job => (
                <div key={job._id} style={{ background: '#F8FAFC', padding: '24px', borderRadius: '24px', marginBottom: '32px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Exam Status for {job.jobListingId?.title}</h4>
                    <div style={{ background: job.quizPassed ? '#D1FAE5' : '#FEE2E2', color: job.quizPassed ? '#059669' : '#DC2626', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                      {job.quizPassed ? `Passed (${job.quizScore}%)` : job.quizScore > 0 ? `Failed (${job.quizScore}%)` : 'Not Started'}
                    </div>
                  </div>
                  
                  {job.quizScore === 0 && (
                    <button 
                      onClick={() => startQuiz(job._id)}
                      style={{ width: '100%', background: '#1E40AF', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                      Start Interview Exam
                    </button>
                  )}
                  
                  {job.quizScore > 0 && !job.quizPassed && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#DC2626', fontWeight: '600', background: '#FEF2F2', borderRadius: '12px' }}>
                      ❌ You did not pass. This application has been moved to Rejections.
                    </div>
                  )}
                  
                  {job.quizPassed && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#059669', fontWeight: '600', background: '#F0FDF4', borderRadius: '12px' }}>
                      ✨ Congratulations! You've passed. View your offer in the Offer tab.
                    </div>
                  )}
                </div>
              ))}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '24px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📋 Common Questions
                  </h4>
                  <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
                    <li>Tell us about your experience with car detailing/washing.</li>
                    <li>How do you handle a high-pressure environment?</li>
                    <li>What does great customer service mean to you?</li>
                    <li>How would you handle an unhappy customer?</li>
                    <li>Are you comfortable working with industrial cleaning chemicals?</li>
                  </ul>
                </div>

                <div style={{ background: '#EFF6FF', padding: '24px', borderRadius: '24px', border: '1px solid #DBEAFE' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1E40AF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    ⚖️ Rules & Regulations
                  </h4>
                  <ul style={{ paddingLeft: '20px', color: '#1E40AF', fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
                    <li><strong>Punctuality:</strong> Arrive at least 15 minutes before your shift.</li>
                    <li><strong>Uniform:</strong> Clean company overalls must be worn correctly.</li>
                    <li><strong>Safety:</strong> Mandatory use of gloves and protective gear.</li>
                    <li><strong>Conduct:</strong> No smoking or personal phone use on the wash floor.</li>
                    <li><strong>Integrity:</strong> Treat every vehicle with the utmost care.</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ marginTop: '40px', padding: '20px', background: '#F1F5F9', borderRadius: '20px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
                  💡 Pro Tip: Demonstrate your attention to detail by noticing small spots others might miss.
                </p>
              </div>
            </div>
          </div>
        )}

        {stage === 'offer' && (
          <div style={{ textAlign: 'center', padding: '60px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎊</div>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#059669', marginBottom: '16px' }}>Congratulations!</h2>
            <p style={{ fontSize: '20px', color: '#475569', maxWidth: '600px', margin: '0 auto 32px' }}>
              You've successfully passed the interview stage. Our team will reach out to you shortly with the final onboarding details.
            </p>
            <div style={{ display: 'inline-block', background: '#D1FAE5', color: '#059669', padding: '12px 32px', borderRadius: '50px', fontWeight: '700', fontSize: '18px' }}>
              Welcome to the Team! 🚀
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    if (!showQuiz) return null;

    if (submittingQuiz) {
      return (
        <div className="quiz-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
          <p style={{ fontWeight: '600', marginTop: '20px' }}>Submitting your exam results...</p>
        </div>
      );
    }

    if (quizFinished) {
      const finalPercentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
      return (
        <div className="quiz-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>{finalPercentage >= 75 ? '🎉' : '📚'}</div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '10px' }}>
            {finalPercentage >= 75 ? 'Congratulations!' : 'Keep Studying!'}
          </h2>
          <div style={{ fontSize: '48px', fontWeight: '900', color: finalPercentage >= 75 ? '#059669' : '#DC2626', marginBottom: '20px' }}>
            {finalPercentage}%
          </div>
          <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '500px', textAlign: 'center', marginBottom: '32px' }}>
            {finalPercentage >= 75 
              ? "You've successfully passed the interview exam. Your application has been automatically moved to the Offer tab!"
              : "You didn't reach the 75% passing score. Your application has been moved to the Rejections tab."}
          </p>
          <button 
            onClick={() => { 
              setShowQuiz(false); 
              setQuizFinished(false);
              navigate(finalPercentage >= 75 ? '/offers' : '/rejections');
            }}
            style={{ background: '#1E40AF', color: 'white', padding: '14px 40px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
          >
            Go to {finalPercentage >= 75 ? 'Offer' : 'Rejections'} Tab
          </button>
        </div>
      );
    }

    const q = QUIZ_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

    return (
      <div className="quiz-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <span style={{ color: '#1E40AF', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}>{q.category}</span>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Interview Exam</h2>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#64748B' }}>
              Question {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
            </div>
          </div>

          <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', marginBottom: '48px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#1E40AF', transition: 'width 0.3s ease' }} />
          </div>

          <div style={{ background: '#F8FAFC', padding: '40px', borderRadius: '32px', marginBottom: '32px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '32px', lineHeight: '1.4' }}>{q.question}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  style={{ 
                    textAlign: 'left',
                    padding: '20px 24px',
                    background: 'white',
                    border: '2px solid #E2E8F0',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = '#1E40AF'; e.target.style.background = '#EFF6FF'; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = 'white'; }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => { if(window.confirm('Quit exam? Your progress will be lost.')) setShowQuiz(false); }}
            style={{ background: 'transparent', color: '#EF4444', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            Cancel Exam
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* Pipeline Navigation */}
        <div className="pipeline-header">
          <h1 className="pipeline-title">My Applications</h1>
          <div className="pipeline-tabs">
            {STAGES.map((stageItem, index) => {
              const count = getCount(stageItem);
              const isLocked = count === 0 && stage !== stageItem.key;
              
              return (
                <React.Fragment key={stageItem.key}>
                  {index === 3 && <div className="pipeline-divider" />}
                  <button
                    className={`pipeline-tab ${stage === stageItem.key ? 'active' : ''}`}
                    style={{ 
                      '--tab-color': stageItem.color,
                      opacity: isLocked ? 0.5 : 1,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      filter: isLocked ? 'grayscale(100%)' : 'none'
                    }}
                    onClick={() => {
                      if (!isLocked) navigate(stageItem.route);
                    }}
                    disabled={isLocked}
                    title={isLocked ? "No applications in this stage" : ""}
                  >
                    <span className="tab-icon">{stageItem.icon}</span>
                    <span className="tab-label">{stageItem.label}</span>
                    <span
                      className="tab-count"
                      style={{
                        background: stage === stageItem.key ? stageItem.color : '#E2E8F0',
                        color: stage === stageItem.key ? 'white' : '#64748B',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                  {(index === 0 || index === 1) && (
                    <div className="pipeline-arrow" style={{ opacity: isLocked ? 0.5 : 1 }}>→</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Stage Sub-header */}
        <div className="stage-header">
          <div className="stage-title-row">
            <div className="stage-dot" style={{ background: currentStage.color }} />
            <h2 className="stage-title" style={{ color: currentStage.color }}>
              {currentStage.icon} {currentStage.label}
            </h2>
            <span className="stage-subtitle">{currentStage.subtitle}</span>
          </div>
        </div>

        {/* Content Area */}
        {renderContent()}
        {renderQuiz()}
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
