# Kaamsetu - Job Portal
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-orange)
![MongoDB](https://img.shields.io/badge/MongoDB-9.1.1-green)
A comprehensive, AI-powered job portal built with the MERN stack (MongoDB, Express, React, Node.js) that connects job seekers with employers through an intuitive platform featuring advanced matching algorithms, real-time communication, and fraud detection.

## Features

### For Job Seekers
- **Smart Job Discovery**: Browse and search through available job listings
- **AI-Powered Matching**: TF-IDF similarity algorithm matches candidates with relevant jobs
- **Application Management**: Track and manage all job applications in one dashboard
- **Job Saving**: Save favorite jobs for later consideration
- **Real-time Chat**: Communicate directly with potential employers
- **Profile Management**: Complete user profiles with resume uploads

### For Employers
- **Job Posting**: Create and manage job listings with detailed requirements
- **Application Review**: Comprehensive dashboard to review and manage applications
- **Candidate Communication**: Real-time chat system for direct candidate interaction
- **Company Verification**: Admin-verified company profiles for trust and security
- **Analytics Dashboard**: Insights into job performance and applicant statistics

### For Administrators
- **User Management**: Oversee all user accounts and roles
- **Company Verification**: Approve company registrations and verify legitimacy
- **Job Management**: Monitor and manage all job postings
- **Fraud Detection**: AI-powered system to identify and prevent fraudulent activities
- **Analytics**: Comprehensive platform statistics and user behavior insights

### Advanced Features
- **Fraud Detection**: External API integration for identifying suspicious activities
- **Email Notifications**: Automated email system for important updates and alerts
- **Payment Integration**: eSewa payment gateway for premium features
- **Role-Based Access Control**: Secure authentication with JWT tokens
- **File Upload System**: Resume and document management
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Frontend
- **React 19.2.0** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Hot Toast** - User notifications
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Additional Services
- **Nodemailer** - Email service integration
- **node-cron** - Scheduled tasks and cron jobs
- **Swagger** - API documentation
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (version 8 or higher) or **yarn**
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/PrasanPoudel/MERN_JOB_PORTAL.git
cd MERN_JOB_PORTAL
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Configure environment variables in .env
# See Environment Variables section below for details
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup

1. **Local MongoDB**: Ensure MongoDB is running locally
2. **MongoDB Atlas**: Create a cluster and update `MONGO_URI` in `.env`

### 5. Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=8000
FRONTEND_URL="http://localhost:5173"
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/kaamsetu?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key"
SMTP_SERVICE="gmail"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
FRAUD_PREDICTOR_API_URL="http://localhost:5000"
ESEWA_SECRET_KEY="your-esewa-secret-key"
```

### 6. Start the Application

```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api-docs

## Project Structure

```
MERN_JOB_PORTAL/
├── backend/                    # Node.js Express server
│   ├── config/                 # Configuration files
│   │   ├── database.js         # MongoDB connection
│   │   └── swagger.js          # API documentation setup
│   ├── controllers/            # Route controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── userController.js   # User management
│   │   ├── jobController.js    # Job operations
│   │   ├── applicationController.js # Application handling
│   │   ├── messageController.js # Chat functionality
│   │   ├── adminController.js  # Admin operations
│   │   └── ...
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js             # User model
│   │   ├── Job.js              # Job model
│   │   ├── Application.js      # Application model
│   │   └── ...
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   │   ├── emailService.js     # Email functionality
│   │   └── cronService.js      # Scheduled tasks
│   ├── middlewares/            # Custom middleware
│   ├── utils/                  # Utility functions
│   │   ├── tfidfSimilarity.js  # AI matching algorithm
│   │   └── pagination.js       # Pagination logic
│   ├── uploads/                # File storage (gitignored)
│   ├── server.js               # Main server file
│   └── package.json
├── frontend/                   # React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── routes/             # Route configuration
│   │   ├── context/            # React context providers
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # App entry point
│   ├── package.json
│   └── vite.config.js
└── README.md                   # This file
```

## API Endpoints

The API is documented using Swagger and available at `/api-docs` when the server is running.

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/profile` - Delete user account

### Job Operations
- `GET /api/jobs` - Get all jobs (with filtering)
- `POST /api/jobs` - Create new job posting
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications` - Get user applications
- `PUT /api/applications/:id/status` - Update application status

### Chat System
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read

## User Roles and Permissions

### Job Seeker
- Browse and search jobs
- Apply to jobs
- Save favorite jobs
- Chat with employers
- Manage personal profile

### Employer
- Post and manage job listings
- Review applications
- Chat with candidates
- Manage company profile
- Access analytics

### Admin
- Manage all users
- Verify companies
- Monitor job postings
- Access platform analytics
- Handle fraud detection

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Comprehensive data validation
- **Fraud Detection**: AI-powered suspicious activity detection

## Analytics and Monitoring

- **User Statistics**: Registration trends and user behavior
- **Job Analytics**: Posting performance and application rates
- **Fraud Monitoring**: Suspicious activity detection and reporting
- **System Health**: Performance metrics and uptime monitoring

## Development Workflow

### Adding New Features

1. **Backend Changes**:
   - Create/update models in `/backend/models/`
   - Add business logic in `/backend/services/`
   - Create controllers in `/backend/controllers/`
   - Define routes in `/backend/routes/`

2. **Frontend Changes**:
   - Create components in `/frontend/src/components/`
   - Add pages in `/frontend/src/pages/`
   - Update routes in `/frontend/src/routes/`
   - Manage state with context or state management

3. **Testing**:
   - Test API endpoints with Swagger documentation
   - Verify frontend functionality
   - Test cross-browser compatibility

### Code Style
- Use ESLint for consistent code formatting
- Follow React best practices
- Maintain consistent naming conventions
- Document complex logic and algorithms

## Deployment

### Backend Deployment
1. **Environment Setup**: Configure production environment variables
2. **Database**: Set up MongoDB Atlas or cloud database
3. **Server**: Deploy to cloud platform (Heroku, AWS, DigitalOcean)
4. **SSL/HTTPS**: Configure secure connections

### Frontend Deployment
1. **Build**: `npm run build` to create production build
2. **Hosting**: Deploy to Netlify, Vercel, or similar platform
3. **Environment**: Configure production API endpoints

### Docker (Optional)
Docker configuration can be added for containerized deployment.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **MERN Stack** - For providing the foundation technology
- **Tailwind CSS** - For beautiful and responsive design
- **MongoDB Atlas** - For reliable database hosting
- **All Contributors** - For their valuable contributions

## Support

For support, email support@kaamsetu.com or create an issue on the GitHub repository.

---

**Kaamsetu** - Connecting Talent with Opportunity
