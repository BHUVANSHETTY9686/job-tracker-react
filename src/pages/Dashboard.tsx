import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, getApplicationStats } from '../services/applicationService';
import { JobApplication } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    accepted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [apps, appStats] = await Promise.all([
          getApplications(),
          getApplicationStats()
        ]);
        
        // Get recent applications (most recent 5)
        const recentApps = [...apps].sort((a, b) => {
          return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
        }).slice(0, 5);
        
        setApplications(recentApps);
        setStats(appStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Convert status string to CSS class
  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace(' ', '-');
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Job Application Dashboard</h2>
        <Link to="/applications/new" className="btn btn-primary">Add New Application</Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <h2>{stats.total}</h2>
          <p>Total Applications</p>
        </div>
        <div className="stat-card applied">
          <h2>{stats.applied}</h2>
          <p>Applied</p>
        </div>
        <div className="stat-card interview">
          <h2>{stats.interview}</h2>
          <p>Interviews</p>
        </div>
        <div className="stat-card offer">
          <h2>{stats.offer}</h2>
          <p>Offers</p>
        </div>
        <div className="stat-card rejected">
          <h2>{stats.rejected}</h2>
          <p>Rejections</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Applications</h3>
          <Link to="/applications" className="view-all">View All</Link>
        </div>
        
        {applications.length === 0 ? (
          <div className="empty-message">
            <p>No applications yet. Start tracking your job search journey!</p>
            <Link to="/applications/new" className="btn btn-primary">Add Your First Application</Link>
          </div>
        ) : (
          <div className="recent-applications">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>{app.company_name}</td>
                    <td>{app.job_title}</td>
                    <td>{formatDate(app.application_date)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/applications/${app.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Unity C# Resources</h3>
        </div>
        <div className="resources-grid">
          <div className="resource-card">
            <h4>Unity Job Portal</h4>
            <p>Browse official job postings from Unity Technologies.</p>
            <a href="https://careers.unity.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Visit Site
            </a>
          </div>
          <div className="resource-card">
            <h4>Unity Learn</h4>
            <p>Access free Unity tutorials to improve your skills.</p>
            <a href="https://learn.unity.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Start Learning
            </a>
          </div>
          <div className="resource-card">
            <h4>Unity Forum</h4>
            <p>Connect with other Unity developers and get help.</p>
            <a href="https://forum.unity.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
