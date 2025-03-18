import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getApplicationById, deleteApplication } from '../services/applicationService';
import { JobApplication } from '../types';
import './ApplicationDetail.css';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getApplicationById(parseInt(id));
        setApplication(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching application details:', err);
        setError('Failed to load application details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleDelete = async () => {
    if (!application?.id) return;
    
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(application.id);
        navigate('/applications');
      } catch (err) {
        console.error('Error deleting application:', err);
        alert('Failed to delete application. Please try again.');
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Convert status string to CSS class
  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace(' ', '-');
  };

  if (loading) {
    return <div className="loading">Loading application details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!application) {
    return <div className="error-container">Application not found.</div>;
  }

  return (
    <div className="application-detail">
      <div className="detail-header">
        <div className="header-content">
          <h2>{application.job_title}</h2>
          <span className={`status-badge ${getStatusClass(application.status)}`}>
            {application.status}
          </span>
        </div>
        <div className="header-actions">
          <Link to={`/applications/${application.id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="detail-cards">
        <div className="detail-card">
          <div className="card-title">Company Information</div>
          <div className="card-content">
            <p className="company-name">{application.company_name}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="card-title">Application Information</div>
          <div className="card-content">
            <div className="detail-row">
              <div className="detail-label">Applied On</div>
              <div className="detail-value">{formatDate(application.application_date)}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">Last Updated</div>
              <div className="detail-value">{formatDate(application.last_updated)}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">Resume Version</div>
              <div className="detail-value">{application.resume_version || 'N/A'}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">Cover Letter</div>
              <div className="detail-value">{application.cover_letter_version || 'N/A'}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Credentials Used</div>
              <div className="detail-value">{application.credentials_used || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {application.job_description && (
        <div className="detail-section">
          <h3>Job Description</h3>
          <div className="job-description">
            <p>{application.job_description}</p>
          </div>
        </div>
      )}

      {application.notes && (
        <div className="detail-section">
          <h3>Notes</h3>
          <div className="notes">
            <p>{application.notes}</p>
          </div>
        </div>
      )}

      <div className="detail-footer">
        <Link to="/applications" className="btn btn-secondary">
          Back to Applications
        </Link>
      </div>
    </div>
  );
};

export default ApplicationDetail;
