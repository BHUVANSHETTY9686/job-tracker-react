export enum ApplicationStatus {
  Draft = 'Draft',
  Applied = 'Applied',
  InProgress = 'In Progress',
  Interview = 'Interview',
  Offer = 'Offer',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn'
}

export interface JobApplication {
  id?: number;
  company_name: string;
  job_title: string;
  job_description?: string;
  application_date: string;
  resume_version?: string;
  cover_letter_version?: string;
  status: ApplicationStatus;
  credentials_used?: string;
  notes?: string;
  last_updated?: string;
}

export interface ApplicationFormData {
  company_name: string;
  job_title: string;
  job_description: string;
  application_date: string;
  resume_version: string;
  cover_letter_version: string;
  status: ApplicationStatus;
  credentials_used: string;
  notes: string;
}
