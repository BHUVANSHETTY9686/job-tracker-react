import supabase from './supabaseClient';
import { JobApplication } from '../types';

// Get all job applications
export const getApplications = async (): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .order('application_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
  
  return data || [];
};

// Get a single job application by ID
export const getApplicationById = async (id: number): Promise<JobApplication | null> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching application ${id}:`, error);
    throw error;
  }
  
  return data;
};

// Create a new job application
export const createApplication = async (application: Omit<JobApplication, 'id' | 'last_updated'>): Promise<JobApplication> => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([{ ...application, last_updated: new Date().toISOString() }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating application:', error);
    throw error;
  }
  
  return data;
};

// Update an existing job application
export const updateApplication = async (id: number, application: Partial<JobApplication>): Promise<JobApplication> => {
  const { data, error } = await supabase
    .from('job_applications')
    .update({ ...application, last_updated: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating application ${id}:`, error);
    throw error;
  }
  
  return data;
};

// Delete a job application
export const deleteApplication = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting application ${id}:`, error);
    throw error;
  }
};

// Get statistics for dashboard
export const getApplicationStats = async () => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*');
    
  if (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
  
  const applications = data || [];
  
  return {
    total: applications.length,
    applied: applications.filter(app => app.status === 'Applied').length,
    interview: applications.filter(app => app.status === 'Interview').length,
    offer: applications.filter(app => app.status === 'Offer').length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
    accepted: applications.filter(app => app.status === 'Accepted').length
  };
};
