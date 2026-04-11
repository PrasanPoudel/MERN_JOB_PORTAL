# KAAMSETU - Nepal's Job Portal

A full-stack MERN (MongoDB, Express.js, React, Node.js) job portal application that connects job seekers with employers. Built with modern technologies and best practices for a seamless user experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Seeding](#database-seeding)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

## Overview

KAAMSETU is a comprehensive job portal platform designed for the Nepalese job market. The application facilitates connections between job seekers and employers through a modern, responsive interface. It supports three primary user roles: Job Seekers, Employers, and Administrators, each with distinct capabilities and dashboards.

The platform includes advanced features such as fraud detection for job postings, premium subscription management via eSewa payment gateway, real-time messaging between users, and comprehensive analytics for both employers and administrators.

## Features

### For Job Seekers

- Browse and search job listings with advanced filters (location, job type, experience level, salary range)
- Apply for jobs with pre-filled profile information
- Save and bookmark interesting job postings for later review
- Track application status (pending, reviewed, accepted, rejected)
- Direct messaging system to communicate with employers
- Profile management including skills, experience, education, and resume upload
- View recommended jobs based on profile and search history
- Receive email notifications for application updates

### For Employers

- Post new job listings with detailed descriptions, requirements, and company information
- Manage job postings (edit, delete, mark as filled, pause/activate)
- Review and manage job applications with status updates
- Search and filter job seeker profiles by skills, experience, and location
- Company profile management with logo, description, and contact information
- Analytics dashboard showing job post performance, application statistics, and viewer metrics
- Direct messaging with potential candidates
- Premium features for enhanced visibility and candidate access

### For Administrators

- Complete user management (view, edit, suspend, delete job seekers and employers)
- Job posting moderation and approval workflow
- Platform-wide analytics and statistics dashboard
- System configuration and settings management
- Monitor user activity and platform health
- Manage premium subscriptions and payments
- Content moderation and fraud detection oversight

### Additional Features

- **Authentication & Authorization**: JWT-based secure authentication with role-based access control and protected routes
- **Real-time Messaging**: WebSocket-enabled direct communication between job seekers and employers
- **Premium Subscriptions**: Payment integration with eSewa for premium features and enhanced visibility
- **Fraud Detection**: Integration with external fraud prediction API to identify and flag suspicious job postings
- **Email Notifications**: Automated email notifications for application status changes, new messages, and important updates using Nodemailer
- **Image Upload**: Cloudinary integration for secure and optimized storage of profile pictures, company logos, and resume documents
- **Rate Limiting**: API rate limiting to prevent abuse and ensure fair usage across all endpoints
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation for all API endpoints
- **Responsive Design**: Mobile-first design approach using Tailwind CSS for consistent experience across all devices
- **Error Handling**: Centralized error handling with detailed error messages and logging
- **Data Validation**: Comprehensive input validation on both client and server sides

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI component library |
| Vite | 7.2.4 | Build tool and development server |
| React Router | 7.11.0 | Client-side routing and navigation |
| Tailwind CSS | 4.1.18 | Utility-first CSS framework |
| Axios | 1.13.2 | HTTP client for API communication |
| Framer Motion | 12.23.26 | Animation and motion library |
| Lucide React | 0.562.0 | Icon library with customizable icons |
| React Hot Toast | 2.6.0 | Toast notification system |
| Recharts | 3.7.0 | Chart library for data visualization |
| Moment.js | 2.30.1 | Date and time formatting |
| React Phone Number Input | 3.4.16 | Phone number input with validation |
| libphonenumber-js | 1.12.41 | Phone number parsing and formatting |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | JavaScript runtime environment |
| Express.js | 5.2.1 | Web application framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 9.1.1 | MongoDB object modeling tool |
| JSON Web Token | 9.0.3 | JWT implementation for authentication |
| Bcrypt.js | 3.0.3 | Password hashing and verification |
| Nodemailer | 8.0.1 | Email sending library |
| Cloudinary | 1.41.3 | Cloud-based image and video storage |
| Multer | 2.0.2 | Middleware for handling file uploads |
| Multer Storage Cloudinary | 4.0.0 | Cloudinary storage engine for Multer |
| Node-cron | 3.0.3 | Cron job scheduling library |
| Swagger JSDoc | 6.2.8 | API documentation generator |
| Swagger UI Express | 5.0.1 | Interactive API documentation UI |
| Express Rate Limit | 8.2.1 | Rate limiting middleware |
| CORS | 2.8.5 | Cross-origin resource sharing middleware |
| Dotenv | 17.2.3 | Environment variable management |
| UUID | 13.0.0 | Unique identifier generation |

### Development Tools

| Technology | Purpose |
|------------|---------|
| ESLint | JavaScript/JSX linting and code quality |
| Nodemon | Auto-restart development server on file changes |
| Vite | Fast development server with HMR |

## Project Structure

```
stopped/
├── frontend/                              # React frontend application
│   ├── public/                            # Static public assets
│   │   └── vite.svg                       # Favicon
│   ├── src/
│   │   ├── assets/                        # Images, fonts, and static assets
│   │   ├── components/                    # Reusable UI components
│   │   │   ├── common/                    # Common components (Button, Input, etc.)
│   │   │   ├── layout/                    # Layout components (Header, Footer, Sidebar)
│   │   │   └── ui/                        # UI-specific components
│   │   ├── context/                       # React Context for global state management
│   │   │   └── AuthContext.jsx            # Authentication state context
│   │   ├── pages/                         # Page-level components
│   │   │   ├── Admin/                     # Admin dashboard and management pages
│   │   │   │   ├── Dashboard.jsx          # Admin main dashboard
│   │   │   │   ├── Users.jsx              # User management
│   │   │   │   └── Analytics.jsx          # Platform analytics
│   │   │   ├── Auth/                      # Authentication pages
│   │   │   │   ├── Login.jsx              # Login page
│   │   │   │   ├── Register.jsx           # Registration page
│   │   │   │   └── ForgotPassword.jsx     # Password recovery
│   │   │   ├── Chat/                      # Messaging interface
│   │   │   │   └── ChatWindow.jsx         # Real-time chat component
│   │   │   ├── Employer/                  # Employer-specific pages
│   │   │   │   ├── Dashboard.jsx          # Employer dashboard
│   │   │   │   ├── PostJob.jsx            # Job posting form
│   │   │   │   ├── ManageJobs.jsx         # Manage posted jobs
│   │   │   │   ├── Applications.jsx       # View applications
│   │   │   │   └── CompanyProfile.jsx     # Company profile management
│   │   │   ├── JobSeeker/                 # Job seeker-specific pages
│   │   │   │   ├── Dashboard.jsx          # Job seeker dashboard
│   │   │   │   ├── Profile.jsx            # Profile management
│   │   │   │   ├── SavedJobs.jsx          # Saved job listings
│   │   │   │   └── MyApplications.jsx     # Application tracking
│   │   │   ├── LandingPage/               # Public home page
│   │   │   │   └── Home.jsx               # Landing page component
│   │   │   ├── Payment/                   # Payment and subscription pages
│   │   │   │   └── Premium.jsx            # Premium subscription page
│   │   │   └── Shared/                    # Shared pages
│   │   │       └── NotFound.jsx           # 404 page
│   │   ├── routes/                        # Route definitions and protected routes
│   │   │   └── ProtectedRoute.jsx         # Route protection wrapper
│   │   ├── utils/                         # Utility functions
│   │   │   └── helpers.js                 # Helper functions
│   │   ├── App.jsx                        # Main application component
│   │   ├── main.jsx                       # Application entry point
│   │   └── index.css                      # Global styles and Tailwind imports
│   ├── .env.example                       # Environment variables template
│   ├── .gitignore                         # Git ignore file
│   ├── eslint.config.js                   # ESLint configuration
│   ├── index.html                         # HTML entry point
│   ├── package.json                       # Dependencies and scripts
│   ├── vite.config.js                     # Vite configuration
│   └── vercel.json                        # Vercel deployment configuration
│
├── backend/                               # Node.js backend application
│   ├── config/                            # Configuration files
│   │   ├── database.js                    # MongoDB connection configuration
│   │   └── swagger.js                     # Swagger documentation setup
│   ├── controllers/                       # Route controllers
│   │   ├── authController.js              # Authentication logic
│   │   ├── userController.js              # User management logic
│   │   ├── jobController.js               # Job CRUD operations
│   │   ├── applicationController.js       # Application handling
│   │   ├── messageController.js           # Messaging logic
│   │   ├── analyticsController.js         # Analytics data
│   │   ├── adminController.js             # Admin operations
│   │   └── paymentController.js           # Payment processing
│   ├── middlewares/                       # Express middleware
│   │   ├── authMiddleware.js              # JWT authentication middleware
│   │   ├── errorMiddleware.js             # Error handling middleware
│   │   └── validationMiddleware.js        # Input validation middleware
│   ├── models/                            # MongoDB schemas
│   │   ├── User.js                        # User schema (job seekers, employers, admins)
│   │   ├── Job.js                         # Job listing schema
│   │   ├── Application.js                 # Job application schema
│   │   ├── Message.js                     # Message/conversation schema
│   │   ├── SavedJob.js                    # Saved jobs schema
│   │   ├── PremiumSubscription.js         # Premium subscription schema
│   │   └── TempMail.js                    # Temporary email verification schema
│   ├── routes/                            # API route definitions
│   │   ├── authRoutes.js                  # /api/auth endpoints
│   │   ├── userRoutes.js                  # /api/user endpoints
│   │   ├── jobRoutes.js                   # /api/jobs endpoints
│   │   ├── applicationRoutes.js           # /api/applications endpoints
│   │   ├── savedJobRoutes.js              # /api/save-jobs endpoints
│   │   ├── analyticsRoutes.js             # /api/analytics endpoints
│   │   ├── messageRoutes.js               # /api/messages endpoints
│   │   ├── adminRoutes.js                 # /api/admin endpoints
│   │   └── paymentRoutes.js               # /api/payment endpoints
│   ├── services/                          # Business logic services
│   │   ├── emailService.js                # Email sending service
│   │   ├── cronService.js                 # Scheduled tasks
│   │   └── fraudDetectionService.js       # Fraud detection integration
│   ├── utils/                             # Utility functions
│   │   ├── validators.js                  # Input validation utilities
│   │   ├── helpers.js                     # Helper functions
│   │   └── constants.js                   # Application constants
│   ├── uploads/                           # Uploaded files storage
│   │   ├── profiles/                      # Profile images
│   │   ├── resumes/                       # Resume/CV files
│   │   └── company-logos/                 # Company logo images
│   ├── .env.example                       # Environment variables template
│   ├── .gitignore                         # Git ignore file
│   ├── package.json                       # Dependencies and scripts
│   ├── server.js                          # Express server entry point
│   └── seedUsers.js                       # Database seeder script
│
├── .gitignore                             # Root git ignore file
└── README.md                              # This documentation file
```

## Database Schema

### User Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'jobSeeker', 'employer', 'admin'),
  phone: String,
  location: String,
  
  // Job Seeker specific fields
  skills: [String],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  resume: String (URL),
  profileImage: String (URL),
  bio: String,
  
  // Employer specific fields
  companyName: String,
  companyDescription: String,
  companyLocation: String,
  companyWebsite: String,
  companyLogo: String (URL),
  
  // Common fields
  isVerified: Boolean,
  isPremium: Boolean,
  premiumExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Schema

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  requirements: [String],
  employer: ObjectId (ref: User),
  location: String,
  jobType: String (enum: 'full-time', 'part-time', 'contract', 'remote'),
  experienceLevel: String (enum: 'entry', 'mid', 'senior'),
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  category: String,
  isFraud: Boolean,
  fraudScore: Number,
  status: String (enum: 'active', 'closed', 'paused'),
  applicationCount: Number,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date
}
```

### Application Schema

```javascript
{
  _id: ObjectId,
  job: ObjectId (ref: Job),
  applicant: ObjectId (ref: User),
  coverLetter: String,
  resume: String (URL),
  status: String (enum: 'pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'),
  appliedAt: Date,
  updatedAt: Date
}
```

### Message Schema

```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  isRead: Boolean,
  createdAt: Date
}
```

## API Endpoints

The API is documented using Swagger/OpenAPI. Once the backend is running, access the interactive documentation at `http://localhost:8000/api-docs`.

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password with token |
| GET | `/api/auth/verify-email/:token` | Verify email address |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update user profile |
| PUT | `/api/user/change-password` | Change password |
| DELETE | `/api/user/account` | Delete user account |
| GET | `/api/user/:id` | Get user by ID (public profile) |

### Job Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs with pagination and filters |
| GET | `/api/jobs/:id` | Get job by ID |
| POST | `/api/jobs` | Create new job (employer only) |
| PUT | `/api/jobs/:id` | Update job (employer only) |
| DELETE | `/api/jobs/:id` | Delete job (employer only) |
| GET | `/api/jobs/employer/my-jobs` | Get employer's jobs |
| GET | `/api/jobs/search` | Search jobs with keywords |

### Application Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get user's applications (job seeker) |
| POST | `/api/applications/:jobId` | Apply for a job |
| GET | `/api/applications/job/:jobId` | Get applications for a job (employer) |
| PUT | `/api/applications/:id/status` | Update application status (employer) |
| DELETE | `/api/applications/:id` | Withdraw application |

### Saved Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/save-jobs` | Get saved jobs |
| POST | `/api/save-jobs/:jobId` | Save a job |
| DELETE | `/api/save-jobs/:jobId` | Unsave a job |

### Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get user's messages |
| GET | `/api/messages/:userId` | Get conversation with user |
| POST | `/api/messages/:userId` | Send message to user |
| PUT | `/api/messages/:id/read` | Mark message as read |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/job-stats` | Get job statistics (employer) |
| GET | `/api/analytics/application-stats` | Get application statistics (job seeker) |
| GET | `/api/analytics/platform-stats` | Get platform-wide statistics (admin) |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/users/:id` | Get user details |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/jobs` | Get all jobs |
| PUT | `/api/admin/jobs/:id/status` | Update job status |
| DELETE | `/api/admin/jobs/:id` | Delete job |

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-subscription` | Create premium subscription |
| POST | `/api/payment/verify-payment` | Verify eSewa payment |
| GET | `/api/payment/subscription-status` | Get subscription status |

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **MongoDB** - Either a local installation or a MongoDB Atlas cloud database account
- **Git** - For cloning the repository

To verify installations, run the following commands in your terminal:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show npm version
git --version     # Should show git version
```

### Installation

Follow these steps to set up the project locally:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/PrasanPoudel/MERN_JOB_PORTAL.git
cd MERN_JOB_PORTAL
```

#### Step 2: Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create the environment configuration file:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit the `.env` file with your configuration values. See the Environment Configuration section below for details.

#### Step 3: Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create the environment configuration file:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit the `.env` file with your configuration values.

### Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

| Variable | Required | Description | Default Value | Example |
|----------|----------|-------------|---------------|---------|
| `PORT` | No | Server port number | `8000` | `8000` |
| `FRONTEND_URL` | Yes | Frontend application URL for CORS | - | `http://localhost:5173` |
| `BACKEND_URL` | Yes | Backend API URL | - | `http://localhost:8000` |
| `MONGO_URI` | Yes | MongoDB connection string | - | `mongodb://localhost:27017/kaamsetu` |
| `JWT_SECRET` | Yes | Secret key for JWT token signing | - | `your-super-secret-key-here` |
| `EMAIL_USER` | No | SMTP email address for notifications | - | `your-email@gmail.com` |
| `EMAIL_PASS` | No | SMTP email password or app password | - | `your-app-password` |
| `SMTP_SERVICE` | No | Email service provider | `gmail` | `gmail` |
| `SMTP_HOST` | No | SMTP server host | `smtp.gmail.com` | `smtp.gmail.com` |
| `SMTP_PORT` | No | SMTP server port | `587` | `587` |
| `FRAUD_PREDICTOR_API_URL` | No | Fraud detection API endpoint | - | `http://localhost:5000` |
| `ESEWA_SECRET_KEY` | No | eSewa payment gateway secret key | - | `your-esewa-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name | - | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key | - | `your-api-key` |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret | - | `your-api-secret` |

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_BACKEND_URL` | Yes | Backend API URL | `http://localhost:8000` |
| `VITE_FRONTEND_URL` | No | Frontend URL (for callbacks) | `http://localhost:5173` |

### Database Seeding

The project includes a seed script that creates default test users for development and testing purposes.

Run the seed script from the backend directory:

```bash
cd backend
npm run seed
```

This creates the following test accounts:

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | `jobseeker@kaamsetu.com` | `Password123` |
| Employer | `employer@kaamsetu.com` | `Password123` |
| Admin | `admin@kaamsetu.com` | `Password123` |

**Note:** The seed script will not overwrite existing users. If you need to reset the database, manually delete the users from MongoDB before running the seed script again.

## Running the Application

### Development Mode

#### Start the Backend Server

Open a terminal in the backend directory and run:

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:8000`. You should see the message "Server running on PORT 8000" in the console.

#### Start the Frontend Development Server

Open a new terminal in the frontend directory and run:

```bash
cd frontend
npm run run dev
```

The development server will start on `http://localhost:5173`. The application will automatically reload when you make changes to the source files.

### Accessing the Application

1. Open your web browser and navigate to `http://localhost:5173`
2. Click on "Login" and use one of the test accounts listed above
3. Explore the features based on your selected role

### API Documentation

With the backend server running, access the interactive Swagger API documentation at:

```
http://localhost:8000/api-docs
```

This provides a complete reference of all available API endpoints, request/response formats, and allows you to test endpoints directly from the browser.

## Configuration

### Email Configuration

Email notifications require SMTP configuration. For Gmail:

1. Enable two-factor authentication on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Add the App Password to `EMAIL_PASS` in your backend `.env` file

For other email providers, update `SMTP_SERVICE`, `SMTP_HOST`, and `SMTP_PORT` accordingly.

### Cloudinary Setup

Cloudinary is used for storing profile images, company logos, and resume files:

1. Create a free account at https://cloudinary.com/
2. Navigate to the Dashboard to find your credentials
3. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to your backend `.env` file

### eSewa Payment Integration

For premium subscription functionality:

1. Register for an eSewa merchant account at https://esewa.com.np/
2. Obtain your merchant secret key from the eSewa dashboard
3. Add the secret key to `ESEWA_SECRET_KEY` in your backend `.env` file

**Note:** For development, you can use eSewa's sandbox environment. Update the payment URLs in the payment controller to use sandbox endpoints.

### Fraud Detection API

The application can integrate with an external fraud detection service:

1. Set up the fraud prediction API (provided separately)
2. Configure `FRAUD_PREDICTOR_API_URL` in your backend `.env` file
3. The system will automatically analyze new job postings for potential fraud

## Deployment

### Frontend Deployment

#### Vercel (Recommended)

The frontend includes a `vercel.json` configuration file for easy deployment:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel
```

Follow the prompts to complete deployment. Environment variables should be configured in the Vercel dashboard.

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Backend Deployment

#### Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Create a new project: `railway init`
4. Add MongoDB plugin from Railway dashboard
5. Deploy: `railway up`
6. Set environment variables in Railway dashboard

#### Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables in Render dashboard
6. Deploy

#### Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create kaamsetu-api

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
# ... set other variables

# Deploy
git push heroku main
```

#### AWS (EC2)

1. Launch an EC2 instance with Ubuntu
2. Install Node.js, npm, and MongoDB
3. Clone the repository
4. Install dependencies and configure environment variables
5. Use PM2 for process management: `pm2 start backend/server.js --name kaamsetu-api`
6. Configure Nginx as a reverse proxy
7. Set up SSL with Let's Encrypt

### Environment Variables for Production

Ensure all required environment variables are set in your production environment. Never commit `.env` files to version control.

## Security Features

The application implements several security measures:

- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies option
- **Password Hashing**: Bcrypt with salt rounds for password storage
- **Rate Limiting**: API rate limiting to prevent brute force attacks (25 requests per 10 minutes for auth, 250 for other endpoints)
- **CORS Protection**: Configured to allow only specified origins
- **Input Validation**: Server-side validation for all user inputs
- **Fraud Detection**: Integration with fraud prediction API for job posting analysis
- **XSS Protection**: Sanitization of user inputs
- **Helmet.js**: Security headers middleware (can be added)
- **MongoDB Injection Protection**: Mongoose provides built-in protection

## Troubleshooting

### Common Issues

#### MongoDB Connection Error

**Problem:** "MongoServerError: connect ECONNREFUSED"

**Solution:**
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify `MONGO_URI` in `.env` is correct
- For MongoDB Atlas, ensure IP whitelist includes your IP address

#### Port Already in Use

**Problem:** "Error: listen EADDRINUSE: address already in use"

**Solution:**
- Change the PORT in backend `.env` file
- Or kill the process using the port:
  - Windows: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`
  - macOS/Linux: `lsof -ti:8000 | xargs kill -9`

#### CORS Error

**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly
- Check that the backend server is running
- Verify the frontend is making requests to the correct backend URL

#### Environment Variables Not Loading

**Problem:** Environment variables are undefined

**Solution:**
- Ensure `.env` file is in the correct directory (same level as `package.json`)
- Restart the development server after modifying `.env`
- Check for typos in variable names
- Ensure no spaces around the `=` sign in `.env`

#### Email Not Sending

**Problem:** Email notifications are not being sent

**Solution:**
- Verify SMTP credentials in `.env`
- For Gmail, ensure App Password is used (not regular password)
- Check if "Less secure app access" is enabled (for non-2FA accounts)
- Review email service logs in the backend console

#### Build Errors

**Problem:** Frontend build fails

**Solution:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Ensure all dependencies are installed
- Check for syntax errors in source files

### Debug Mode

To enable detailed logging, add `DEBUG=true` to your backend `.env` file. This will output additional information to the console for debugging purposes.

## Contributing

We welcome contributions to the KAAMSETU project. Please follow these guidelines:

### Contribution Process

1. Fork the repository to your GitHub account
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and ensure code follows the existing style
4. Write or update tests if applicable
5. Commit your changes with a descriptive commit message:
   ```bash
   git commit -m "Add feature: description of your feature"
   ```
6. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request on GitHub with a clear description of changes
8. Wait for code review and address any feedback

### Coding Standards

- Follow ESLint rules (run `npm run lint` in frontend directory)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single responsibility
- Use async/await for asynchronous operations
- Handle errors appropriately with try-catch blocks

### Reporting Issues

- Use the GitHub Issues tab to report bugs or request features
- Include detailed information: steps to reproduce, expected behavior, actual behavior
- Add screenshots or screen recordings when helpful
- Include environment information (OS, Node version, browser)

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Author

**Prasan Poudel**

- GitHub: https://github.com/PrasanPoudel
- Project Repository: https://github.com/PrasanPoudel/MERN_JOB_PORTAL

## Acknowledgments

- MongoDB team for the excellent NoSQL database
- Vercel for frontend hosting and deployment platform
- Cloudinary for image and media storage services
- eSewa for payment gateway integration in Nepal
- All open-source contributors whose libraries made this project possible
- The React, Express, and Node.js communities

## Support

For support, questions, or feedback:

- Open an issue in the GitHub repository
- Email: Contact through GitHub
- Project Discussion: Use GitHub Discussions tab

---

Last updated: April 2026