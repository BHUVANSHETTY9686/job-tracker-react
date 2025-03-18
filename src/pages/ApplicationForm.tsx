import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createApplication, getApplicationById, updateApplication } from '../services/applicationService';
import { ApplicationStatus, JobApplication, ApplicationFormData } from '../types';
import './ApplicationForm.css';

const initialFormState: ApplicationFormData = {
  company_name: '',
  job_title: '',
  job_description: '',
  application_date: new Date().toISOString().split('T')[0],
  resume_version: '',
  cover_letter_version: '',
  status: ApplicationStatus.Draft,
  credentials_used: '',
  notes: ''
};

const ApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!id;

  useEffect(() => {
    // If in edit mode, fetch the application data
    if (isEditing) {
      const fetchApplication = async () => {
        try {
          setLoading(true);
          const data = await getApplicationById(parseInt(id));
          if (data) {
            setFormData({
              company_name: data.company_name,
              job_title: data.job_title,
              job_description: data.job_description || '',
              application_date: data.application_date.split('T')[0],
              resume_version: data.resume_version || '',
              cover_letter_version: data.cover_letter_version || '',
              status: data.status as ApplicationStatus,
              credentials_used: data.credentials_used || '',
              notes: data.notes || ''
            });
          }
        } catch (err) {
          console.error('Error fetching application:', err);
          setError('Failed to load application data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchApplication();
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (isEditing && id) {
        await updateApplication(parseInt(id), formData);
      } else {
        await createApplication(formData);
      }
      
      navigate('/applications');
    } catch (err) {
      console.error('Error saving application:', err);
      setError('Failed to save application. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading application data...</div>;
  }

  return (
    <div className="application-form-container">
      <h2>{isEditing ? 'Edit Job Application' : 'Add New Job Application'}</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company_name" className="form-label">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="job_title" className="form-label">Job Title *</label>
            <input
              type="text"
              id="job_title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="application_date" className="form-label">Application Date *</label>
            <input
              type="date"
              id="application_date"
              name="application_date"
              value={formData.application_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
              required
            >
              {Object.values(ApplicationStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="resume_version" className="form-label">Resume Version</label>
            <input
              type="text"
              id="resume_version"
              name="resume_version"
              value={formData.resume_version}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Unity Developer v2.1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cover_letter_version" className="form-label">Cover Letter Version</label>
            <input
              type="text"
              id="cover_letter_version"
              name="cover_letter_version"
              value={formData.cover_letter_version}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Custom for Unity"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="credentials_used" className="form-label">Credentials Used</label>
          <input
            type="text"
            id="credentials_used"
            name="credentials_used"
            value={formData.credentials_used}
            onChange={handleChange}
            className="form-control"
            placeholder="Email or account used for application"
          />
        </div>

        <div className="form-group">
          <label htmlFor="job_description" className="form-label">Job Description</label>
          <textarea
            id="job_description"
            name="job_description"
            value={formData.job_description}
            onChange={handleChange}
            className="form-control"
            rows={5}
            placeholder="Copy the job description here for reference"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-control"
            rows={3}
            placeholder="Any additional notes about the application"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/applications')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (isEditing ? 'Update Application' : 'Save Application')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
