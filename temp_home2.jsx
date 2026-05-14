// Home.jsx

import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  FileText,
  Target,
  PartyPopper,
  XCircle,
  PlayCircle,
  CarFront,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="home">
        {/* TOP IMAGE BANNER - 1/3 of page */}
        <div className="top-image-banner">
          <img
            src="/images/homepage.png"
            alt="Car Wash Hero"
            className="top-hero-image"
          />
        </div>

        {/* HERO */}
        <section className="hero">
          {/* LEFT - Text Section */}
          <div className="hero-left">
            <div className="hero-badge">
              ≡ƒÜù Smart Job Tracking For Car Wash Workers
            </div>

            <div className="animated-text-container">
              <h1 className="animated-title">
                Your Dream Job <br />
                <span>Is Closer</span> Than <br />
                Your Next Wash.
              </h1>
            </div>

            <p>
              Track your applications, interviews, offers, and rejections in one
              beautiful dashboard built for car wash job seekers.
            </p>

            {/* STATS SMALL */}
          </div>

          {/* RIGHT - Logo Section */}
          <div className="hero-right">
            <div className="logo-container">
              <img
                src="/images/Temalogo.png"
                alt="JobFlow Logo"
                className="hero-logo-image"
              />
              <div className="logo-glow"></div>
            </div>
          </div>
        </section>

        <div className="hero-buttons">
          <button className="primary-btn">Start Tracking Now</button>

          <button className="secondary-btn">
            <PlayCircle size={20} />
            See How It Works
          </button>
        </div>

        {/* JOB LISTINGS SECTION */}
        <section className="job-listings">
          <div className="section-header">
            <h2>≡ƒôï Available Jobs For You</h2>
            <p>Browse and apply to these open positions</p>
          </div>

          <div className="jobs-container">
            {/* Job 1 - Washer */}
            <div className="job-card-glass">
              <img
                src="/images/carWasher.png"
                alt="Car Washer"
                className="job-image"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x200/2563EB/white?text=carWasher";
                }}
              />
              <div className="job-content">
                <h3>Car Washer</h3>
                <p>
                  Entry-level position. No experience needed. Full training
                  provided. Perfect for beginners starting their career.
                </p>
                <div className="job-badge">≡ƒÄ» 15+ openings</div>
                <button className="apply-job-btn">Apply Now ΓåÆ</button>
              </div>
            </div>

            {/* Job 2 - Accountant */}
            <div className="job-card-glass">
              <img
                src="/images/accountant.png"
                alt="Accountant"
                className="job-image"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x200/F59E0B/white?text=accountant";
                }}
              />
              <div className="job-content">
                <h3>Accountant</h3>
                <p>
                  Manage financial records, payroll, and bookkeeping. QuickBooks
                  experience preferred. CPA not required.
                </p>
                <div className="job-badge">≡ƒÆ░ $45-60k/year</div>
                <button className="apply-job-btn">Apply Now ΓåÆ</button>
              </div>
            </div>

            {/* Job 3 - Manager */}
            <div className="job-card-glass">
              <img
                src="/images/manager.png"
                alt="Operations Manager"
                className="job-image"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x200/F59E0B/white?text=manager";
                }}
              />
              <div className="job-content">
                <h3>Operations Manager</h3>
                <p>
                  Lead daily operations, manage staff, ensure customer
                  satisfaction. 2+ years experience preferred.
                </p>
                <div className="job-badge">≡ƒæö $55-75k/year</div>
                <button className="apply-job-btn">Apply Now ΓåÆ</button>
              </div>
            </div>

            {/* Job 4 - Office Cleaner */}
            <div className="job-card-glass">
              <img
                src="/images/job-cleaner.png"
                alt="Office Cleaner"
                className="job-image"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x200/8B5CF6/white?text=Office+Cleaner";
                }}
              />
              <div className="job-content">
                <h3>Office Cleaner</h3>
                <p>
                  Maintain cleanliness of office and facility areas. Flexible
                  hours. Morning and evening shifts available.
                </p>
                <div className="job-badge">≡ƒº╣ $14-18/hr</div>
                <button className="apply-job-btn">Apply Now ΓåÆ</button>
              </div>
            </div>

            {/* Job 5 - Drivers */}
            <div className="job-card-glass">
              <img
                src="/images/job-driver.png"
                alt="Driver/Valet"
                className="job-image"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x200/EF4444/white?text=Driver";
                }}
              />
              <div className="job-content">
                <h3>Driver / Valet</h3>
                <p>
                  Move customer vehicles safely. Valid driver's license
                  required. Good driving record essential.
                </p>
                <div className="job-badge">≡ƒÜù $16-22/hr + tips</div>
                <button className="apply-job-btn">Apply Now ΓåÆ</button>
              </div>
            </div>
          </div>
        </section>
     
        {/* STATS SECTION */}
        <section className="stats">

     

          <div className="card">
            <div className="icon blue">
              <FileText />
            </div>

            <h2>24</h2>
            <h3>Applied</h3>

            <p>Keep applying consistently.</p>

            <div className="line blue-line"></div>
          </div>

          <div className="card">
            <div className="icon green">
              <Target />
            </div>

            <h2>8</h2>
            <h3 className="green-text">Interviews</h3>

            <p>Companies are noticing you.</p>

            <div className="line green-line"></div>
          </div>

          <div className="card">
            <div className="icon orange">
              <PartyPopper />
            </div>

            <h2>3</h2>
            <h3 className="orange-text">Offers</h3>

            <p>YouΓÇÖre getting opportunities.</p>

            <div className="line orange-line"></div>
          </div>

          <div className="card">
            <div className="icon red">
              <XCircle />
            </div>

            <h2>5</h2>
            <h3 className="red-text">Rejections</h3>

            <p>Every rejection is progress.</p>

            <div className="line red-line"></div>
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <section className="bottom-banner">
          <div className="banner-left">
            <div className="banner-icon">
              <CarFront size={40} />
            </div>

            <div>
              <h2>
                Stay Organized. Stay Motivated.
                <span> Get Hired.</span>
              </h2>

              <p>The smarter way to manage your car wash job applications.</p>
            </div>
          </div>

          <div className="banner-right">
            <div className="feature">
              <TrendingUp />
              <span>Visual Progress</span>
            </div>

            <div className="feature">
              <BadgeCheck />
              <span>Stay Motivated</span>
            </div>

            <div className="feature">
              <FileText />
              <span>Track Applications</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
