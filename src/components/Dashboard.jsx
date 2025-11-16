import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  LogOut,
  Building2,
} from "lucide-react";
import "./JobApplicationTracker.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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

  useEffect(() => {
    if (currentUser) {
      const userApps =
        JSON.parse(localStorage.getItem(`applications_${currentUser.id}`)) ||
        [];
      setApplications(userApps);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = (app) => {
    setCurrentApp(app);
    setFormData(app);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentApp(null);
  };

  const handleUpdate = () => {
    if (
      !formData.company ||
      !formData.position ||
      !formData.portal ||
      !formData.dateApplied
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedApps = applications.map((app) =>
      app.id === currentApp.id
        ? { ...formData, id: currentApp.id, userId: currentUser.id }
        : app
    );

    setApplications(updatedApps);
    localStorage.setItem(
      `applications_${currentUser.id}`,
      JSON.stringify(updatedApps)
    );
    closeEditModal();
  };

  const deleteApplication = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      const updatedApps = applications.filter((app) => app.id !== id);
      setApplications(updatedApps);
      localStorage.setItem(
        `applications_${currentUser.id}`,
        JSON.stringify(updatedApps)
      );
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      Applied: "status-applied",
      "Interview Scheduled": "status-interview-scheduled",
      "Interview Completed": "status-interview-completed",
      "Offer Received": "status-offer",
      Rejected: "status-rejected",
      Withdrawn: "status-withdrawn",
    };
    return classes[status] || "status-default";
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.portal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    interviews: applications.filter((a) => a.status.includes("Interview"))
      .length,
    offers: applications.filter((a) => a.status === "Offer Received").length,
  };

  return (
    <div className="app-container">
      <div className="container">
        <div className="header-card">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <Briefcase size={28} />
              </div>
              <div>
                <h1>Job Application Tracker</h1>
                <p className="subtitle">Welcome back, {currentUser?.name}!</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={() => navigate("/add-application")}
                className="btn-primary"
              >
                <Plus size={20} />
                Add Application
              </button>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-total">
            <h3>Total Applications</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card stat-applied">
            <h3>Applied</h3>
            <p className="stat-number">{stats.applied}</p>
          </div>
          <div className="stat-card stat-interviews">
            <h3>Interviews</h3>
            <p className="stat-number">{stats.interviews}</p>
          </div>
          <div className="stat-card stat-offers">
            <h3>Offers</h3>
            <p className="stat-number">{stats.offers}</p>
          </div>
        </div>

        <div className="search-filter-card">
          <div className="search-filter-grid">
            <div className="input-with-icon">
              <Search className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Search by company, position, or portal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-with-icon">
              <Filter className="input-icon" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="applications-list">
          {filteredApplications.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={64} />
              <h3>No applications found</h3>
              <p>
                Start tracking your job applications by adding your first one!
              </p>
              <button
                onClick={() => navigate("/add-application")}
                className="btn-primary"
                style={{ marginTop: "1.5rem" }}
              >
                <Plus size={20} />
                Add Your First Application
              </button>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="app-content">
                  <div className="app-logo">
                    {app.companyLogo ? (
                      <img
                        src={app.companyLogo}
                        alt={`${app.company} logo`}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="logo-placeholder"
                      style={{ display: app.companyLogo ? "none" : "flex" }}
                    >
                      <Building2 size={32} />
                    </div>
                  </div>

                  <div className="app-main">
                    <div className="app-header">
                      <h3>{app.position}</h3>
                      <span
                        className={`status-badge ${getStatusClass(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="app-company">{app.company}</p>
                    <div className="app-details">
                      <span>
                        <strong>Portal:</strong> {app.portal}
                      </span>
                      <span>
                        <strong>Applied:</strong>{" "}
                        {new Date(app.dateApplied).toLocaleDateString()}
                      </span>
                      {app.location && (
                        <span>
                          <strong>Location:</strong> {app.location}
                        </span>
                      )}
                      {app.salary && (
                        <span>
                          <strong>Salary:</strong> {app.salary}
                        </span>
                      )}
                    </div>
                    {app.notes && <p className="app-notes">{app.notes}</p>}
                  </div>

                  <div className="app-actions">
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-link"
                        title="View Job"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                    <button
                      onClick={() => openEditModal(app)}
                      className="action-btn action-edit"
                      title="Edit"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="action-btn action-delete"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit Application</h2>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field"
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
                  </div>

                  <div className="form-group">
                    <label>Position *</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Portal *</label>
                    <select
                      name="portal"
                      value={formData.portal}
                      onChange={handleInputChange}
                      className="input-field"
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

                  <div className="form-group form-group-full">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Add any notes about the application..."
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={handleUpdate}
                    className="btn-primary btn-full"
                  >
                    Update Application
                  </button>
                  <button
                    onClick={closeEditModal}
                    className="btn-secondary btn-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
