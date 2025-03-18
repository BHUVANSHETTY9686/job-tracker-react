# Job Tracker App for Unity Developers

A modern web application built with React and Supabase to help Unity C# developers track their job applications, interviews, and job search progress.

## Features

- Track all your job applications in one place
- Monitor application status (Draft, Applied, In Progress, Interview, etc.)
- Store job descriptions, resume versions, and cover letter information
- View statistics about your job search
- Responsive design that works on desktop and mobile

## Tech Stack

- **Frontend**: React with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Styling**: Custom CSS

## Deployment Instructions

### 1. Supabase Setup

1. Create a free Supabase account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to SQL Editor and run the following SQL to create your job_applications table:

```sql
CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  application_date DATE NOT NULL,
  resume_version TEXT,
  cover_letter_version TEXT,
  status TEXT NOT NULL,
  credentials_used TEXT,
  notes TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Go to Project Settings > API to get your Supabase URL and anon key

### 2. Environment Variables

Create a `.env` file in the root of your project with:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Netlify Deployment

1. Push your code to a GitHub repository
2. Sign up/log in to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build command to: `npm run build`
6. Set publish directory to: `build`
7. Add Environment Variables (from step 2) in the "Advanced build settings"
8. Click "Deploy site"

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your Supabase credentials
4. Start the development server: `npm start`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

You can customize this application for other types of roles by modifying:
- The application status enum in `src/types/index.ts`
- The form fields in `src/pages/ApplicationForm.tsx`
- The resources section in the Dashboard component

## License

MIT
