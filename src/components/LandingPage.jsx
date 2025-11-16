import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Mail,
  Lock,
  User,
  AlertCircle,
  TrendingUp,
  Target,
  CheckCircle,
} from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);
      login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);
      signup(email, password, name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <TrendingUp size={32} className="brand-icon" />
            <span className="brand-name">Ascend</span>
          </div>
          <div className="navbar-links">
            <button
              onClick={() => scrollToSection("hero")}
              className="nav-link"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="nav-link"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="nav-link"
            >
              Contact
            </button>
            <button
              onClick={() => setShowSignup(!showSignup)}
              className="nav-btn"
            >
              {showSignup ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-container">
          {/* Left Side - Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <Target size={20} />
              <span>Your Job Search Assistant</span>
            </div>
            <h1 className="hero-title">Ascend</h1>
            <p className="hero-tagline">
              Manage your job applications efficiently
            </p>
            <p className="hero-description">
              Track, organize, and manage your job applications across all
              platforms — all in one place.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Track applications from all job portals</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Stay organized with status updates</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Never miss an interview or deadline</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Signup Form */}
          <div className="auth-form-container">
            <div className="auth-form-card">
              <div className="auth-form-header">
                <h2>{showSignup ? "Create Account" : "Login"}</h2>
                <p>
                  {showSignup
                    ? "Start your job tracking journey"
                    : "Welcome back to Ascend"}
                </p>
              </div>

              {error && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form
                onSubmit={showSignup ? handleSignup : handleLogin}
                className="auth-form"
              >
                {showSignup && (
                  <div className="form-field">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <User className="field-icon" size={18} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="field-icon" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <Lock className="field-icon" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        showSignup ? "Create password" : "Enter password"
                      }
                      className="form-input"
                    />
                  </div>
                </div>

                {showSignup && (
                  <div className="form-field">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                      <Lock className="field-icon" size={18} />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading
                    ? "Please wait..."
                    : showSignup
                    ? "Sign Up"
                    : "Login"}
                </button>
              </form>

              <div className="form-footer">
                <p>
                  {showSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    onClick={() => {
                      setShowSignup(!showSignup);
                      setError("");
                    }}
                    className="toggle-link"
                  >
                    {showSignup ? "Login" : "Sign Up"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2>About Ascend</h2>
            <div className="header-line"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="about-intro">
                Ascend is your personal job tracking assistant — helping you
                stay organized throughout your job hunt.
              </p>
              <p>
                With Ascend, you can record every job application, company,
                platform, and update in one unified dashboard. No more scattered
                spreadsheets or forgotten deadlines — just clarity and control
                over your job search journey.
              </p>
            </div>
            <div className="about-visual">
              <div className="career-ladder">
                <div className="ladder-step">
                  <div className="step-number">1</div>
                  <div className="step-label">Track Applications</div>
                </div>
                <div className="ladder-step">
                  <div className="step-number">2</div>
                  <div className="step-label">Manage Interviews</div>
                </div>
                <div className="ladder-step">
                  <div className="step-number">3</div>
                  <div className="step-label">Land Your Dream Job</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Contact Us</h2>
            <div className="header-line"></div>
          </div>
          <div className="contact-content">
            <p className="contact-intro">
              We'd love to hear your feedback or suggestions.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <Mail size={24} />
                <a href="mailto:support@ascendapp.com">support@ascendapp.com</a>
              </div>
              <div className="contact-item">
                <Briefcase size={24} />
                <a
                  href="https://www.ascendapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.ascendapp.com
                </a>
              </div>
            </div>
            <div className="social-links">
              <p>Follow us on:</p>
              <div className="social-buttons">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                >
                  LinkedIn
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                >
                  Twitter
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Ascend. All rights reserved.</p>
          <p>Your journey to success starts here.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
