import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, deleteApplication } from '../services/applicationService';
import { JobApplication, ApplicationStatus } from '../types';
import './ApplicationList.css';

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getApplications();
        setApplications(data);
        setFilteredApplications(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Update filtered applications when filter or applications change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter(app => app.status === filter)
      );
    }
  }, [filter, applications]);

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  // Handle application deletion
  const handleDelete = async (id?: number) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        console.error('Error deleting application:', err);
        alert('Failed to delete application. Please try again.');
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status CSS class
  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace(' ', '-');
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="application-list">
      <div className="list-header">
        <h2>Job Applications</h2>
        <div className="list-actions">
          <div className="filter-controls">
            <label htmlFor="status-filter">Filter by status:</label>
            <select 
              id="status-filter" 
              value={filter} 
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="all">All Applications</option>
              {Object.values(ApplicationStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <Link to="/applications/new" className="btn btn-primary">Add New Application</Link>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {filteredApplications.length === 0 ? (
        <div className="empty-message">
          <p>
            {filter === 'all' 
              ? 'No applications found. Start tracking your job search journey!' 
              : `No applications with status "${filter}" found.`}
          </p>
          {filter === 'all' && (
            <Link to="/applications/new" className="btn btn-primary">Add Your First Application</Link>
          )}
        </div>
      ) : (
        <div className="application-grid">
          {filteredApplications.map(app => (
            <div className="application-card" key={app.id}>
              <div className="card-header">
                <h3>{app.job_title}</h3>
                <span className={`status-badge ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <div className="company-name">{app.company_name}</div>
              <div className="application-date">Applied: {formatDate(app.application_date)}</div>
              {app.resume_version && (
                <div className="resume-version">Resume: {app.resume_version}</div>
              )}
              <div className="card-actions">
                <Link to={`/applications/${app.id}`} className="btn">View Details</Link>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(app.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
