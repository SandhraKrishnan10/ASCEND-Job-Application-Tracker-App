import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ArrowLeft, Building2 } from "lucide-react";
import "./AddApplication.css";

const AddApplication = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    portal: "",
    status: "Applied",
    dateApplied: "",
    salary: "",
    location: "",
    jobUrl: "",
    companyLogo: "",
    notes: "",
  });

  const portals = [
    "LinkedIn",
    "Indeed",
    "Naukri",
    "Monster",
    "Glassdoor",
    "AngelList",
    "Other",
  ];
  const statuses = [
    "Applied",
    "Interview Scheduled",
    "Interview Completed",
    "Offer Received",
    "Rejected",
    "Withdrawn",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.company ||
      !formData.position ||
      !formData.portal ||
      !formData.dateApplied
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const applications =
      JSON.parse(localStorage.getItem(`applications_${currentUser.id}`)) || [];

    const newApp = {
      ...formData,
      id: Date.now(),
      userId: currentUser.id,
    };

    applications.push(newApp);
    localStorage.setItem(
      `applications_${currentUser.id}`,
      JSON.stringify(applications)
    );

    navigate("/dashboard");
  };

  return (
    <div className="add-app-container">
      <div className="add-app-content">
        <div className="add-app-header">
          <button
            onClick={() => navigate("/dashboard")}
            className="back-button"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1>Add New Application</h1>
          <p>Fill in the details of your job application</p>
        </div>

        <form onSubmit={handleSubmit} className="add-app-form">
          <div className="form-section">
            <h2>Company Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Google"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Logo URL</label>
                <input
                  type="url"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                  className="input-field"
                />
                {formData.companyLogo && (
                  <div className="logo-preview">
                    <img
                      src={formData.companyLogo}
                      alt="Company Logo Preview"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="logo-placeholder"
                      style={{ display: "none" }}
                    >
                      <Building2 size={32} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Job Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Developer"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Portal *</label>
                <select
                  name="portal"
                  value={formData.portal}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Portal</option>
                  {portals.map((portal) => (
                    <option key={portal} value={portal}>
                      {portal}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date Applied *</label>
                <input
                  type="date"
                  name="dateApplied"
                  value={formData.dateApplied}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label>Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹8-12 LPA"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore, Remote"
                  className="input-field"
                />
              </div>

              <div className="form-group form-group-full">
                <label>Job URL</label>
                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Notes</h2>
            <div className="form-group">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="5"
                placeholder="Add any notes about the application, interview details, or requirements..."
                className="input-field"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-large">
              Add Application
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn-secondary btn-large"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplication;
