/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john@example.com"
 *         role:
 *           type: string
 *           enum: [jobSeeker, employer, admin]
 *           description: User role in the system
 *           example: "jobSeeker"
 *         avatar:
 *           type: string
 *           description: URL to user's profile picture
 *           example: "http://localhost:8000/uploads/avatar.jpg"
 *         resume:
 *           type: string
 *           description: URL to user's resume file
 *           example: "http://localhost:8000/uploads/resume.pdf"
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user's skills
 *           example: ["JavaScript", "React", "Node.js"]
 *         companyName:
 *           type: string
 *           description: Company name (for employers)
 *           example: "Tech Corp"
 *         companyDescription:
 *           type: string
 *           description: Company description (for employers)
 *         companyLogo:
 *           type: string
 *           description: URL to company logo (for employers)
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *         education:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               degree:
 *                 type: string
 *               institution:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *         certifications:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuingOrganization:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date
 *               expirationDate:
 *                 type: string
 *                 format: date
 * 
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - requirements
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the job
 *         title:
 *           type: string
 *           description: Job title
 *           example: "Senior Frontend Developer"
 *         description:
 *           type: string
 *           description: Detailed job description
 *           example: "We are looking for a skilled frontend developer..."
 *         requirements:
 *           type: string
 *           description: Job requirements and qualifications
 *           example: "3+ years of React experience required"
 *         location:
 *           type: string
 *           description: Job location
 *           example: "Kathmandu, Nepal"
 *         category:
 *           type: string
 *           description: Job category
 *           example: "Technology"
 *         type:
 *           type: string
 *           enum: [Full-Time, Part-Time, Internship, Contract]
 *           description: Employment type
 *           example: "Full-Time"
 *         salaryMin:
 *           type: number
 *           description: Minimum salary
 *           example: 50000
 *         salaryMax:
 *           type: number
 *           description: Maximum salary
 *           example: 80000
 *         isClosed:
 *           type: boolean
 *           description: Whether the job posting is closed
 *           example: false
 *         employer:
 *           type: string
 *           description: ID of the employer who posted the job
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Job creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Job last update timestamp
 * 
 *     Application:
 *       type: object
 *       required:
 *         - job
 *         - applicant
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the application
 *         job:
 *           type: string
 *           description: ID of the job being applied to
 *         applicant:
 *           type: string
 *           description: ID of the applicant
 *         status:
 *           type: string
 *           enum: [Applied, In Interview, Rejected, Hired]
 *           description: Current application status
 *           example: "Applied"
 *         cosineSimilarityScore:
 *           type: number
 *           description: ML-based similarity score between job and applicant
 *           minimum: 0
 *           maximum: 1
 *           example: 0.85
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Application creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Application last update timestamp
 * 
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - recipient
 *         - content
 *         - application
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the message
 *         sender:
 *           type: string
 *           description: ID of the message sender
 *         recipient:
 *           type: string
 *           description: ID of the message recipient
 *         content:
 *           type: string
 *           description: Message content
 *           example: "Hello, I'd like to schedule an interview."
 *         application:
 *           type: string
 *           description: ID of the related job application
 *         isRead:
 *           type: boolean
 *           description: Whether the message has been read
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Message creation timestamp
 * 
 *     Notification:
 *       type: object
 *       required:
 *         - recipient
 *         - type
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the notification
 *         recipient:
 *           type: string
 *           description: ID of the notification recipient
 *         type:
 *           type: string
 *           enum: [application, message, system]
 *           description: Type of notification
 *           example: "application"
 *         message:
 *           type: string
 *           description: Notification message content
 *           example: "Your application has been updated"
 *         isRead:
 *           type: boolean
 *           description: Whether the notification has been read
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Notification creation timestamp
 * 
 *     SavedJob:
 *       type: object
 *       required:
 *         - user
 *         - job
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the saved job
 *         user:
 *           type: string
 *           description: ID of the user who saved the job
 *         job:
 *           type: string
 *           description: ID of the saved job
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Save creation timestamp
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Invalid credentials"
 *         error:
 *           type: string
 *           description: Error details (optional)
 *           example: "Password is incorrect"
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           description: Response data (optional)
 * 
 * tags:
 *   - name: Auth
 *     description: Authentication and user registration
 *   - name: Jobs
 *     description: Job posting and management
 *   - name: Applications
 *     description: Job application management with ML matching
 *   - name: Users
 *     description: User profile management
 *   - name: Messages
 *     description: Real-time messaging between users
 *   - name: Analytics
 *     description: Job posting analytics and statistics
 *   - name: Saved Jobs
 *     description: Job saving and management
 *   - name: Admin
 *     description: Administrative operations and management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User password
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [jobSeeker, employer]
 *                 description: User role
 *                 example: "jobSeeker"
 *               avatar:
 *                 type: string
 *                 description: Optional avatar URL
 *                 example: "http://localhost:8000/uploads/avatar.jpg"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Account is banned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/auth/upload-file:
 *   post:
 *     summary: Upload file (avatar/resume/logo)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (avatar, resume, or logo)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   description: URL of the uploaded file
 *                   example: "http://localhost:8000/uploads/filename.jpg"
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs with filters and ML-based similarity scoring
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search by job title or company name
 *         example: "developer"
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by job location
 *         example: "Kathmandu"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by job category
 *         example: "Technology"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Full-Time, Part-Time, Internship, Contract]
 *         description: Filter by employment type
 *         example: "Full-Time"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID for personalized job matching
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: List of jobs with ML-based similarity scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 total:
 *                   type: integer
 *                   description: Total number of jobs
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Whether there is a next page
 *                 hasPrevPage:
 *                   type: boolean
 *                   description: Whether there is a previous page
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - requirements
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *                 example: "Senior Frontend Developer"
 *               description:
 *                 type: string
 *                 description: Detailed job description
 *                 example: "We are looking for a skilled frontend developer..."
 *               requirements:
 *                 type: string
 *                 description: Job requirements and qualifications
 *                 example: "3+ years of React experience required"
 *               location:
 *                 type: string
 *                 description: Job location
 *                 example: "Kathmandu, Nepal"
 *               category:
 *                 type: string
 *                 description: Job category
 *                 example: "Technology"
 *               type:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Internship, Contract]
 *                 description: Employment type
 *                 example: "Full-Time"
 *               salaryMin:
 *                 type: number
 *                 description: Minimum salary
 *                 example: 50000
 *               salaryMax:
 *                 type: number
 *                 description: Maximum salary
 *                 example: 80000
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job created successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only employers can post jobs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/jobs/get-jobs-employer:
 *   get:
 *     summary: Get all jobs posted by the authenticated employer
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employer's jobs with application counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       job:
 *                         $ref: '#/components/schemas/Job'
 *                       applicationCount:
 *                         type: integer
 *                         description: Number of applications for this job
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only employers can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job details by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID for personalized similarity scoring
 *     responses:
 *       200:
 *         description: Job details with optional similarity score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 similarityScore:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 1
 *                   description: ML-based similarity score (if userId provided)
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   put:
 *     summary: Update job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job updated successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Not authorized to update this job
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job deleted successfully"
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Not authorized to delete this job
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/jobs/{id}/toggle-close:
 *   put:
 *     summary: Toggle job posting open/closed status
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Job status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job status toggled successfully"
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Not authorized to toggle this job
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/applications/{jobId}:
 *   post:
 *     summary: Apply to a job posting
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to apply for
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       201:
 *         description: Application submitted successfully with ML similarity score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Application submitted successfully"
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Already applied or missing resume
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Resume required for job application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/applications/my:
 *   get:
 *     summary: Get all applications submitted by the authenticated user
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       application:
 *                         $ref: '#/components/schemas/Application'
 *                       job:
 *                         $ref: '#/components/schemas/Job'
 *                       employer:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - no token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get all applicants for a specific job (Employer only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: List of applicants with their details and similarity scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       application:
 *                         $ref: '#/components/schemas/Application'
 *                       applicant:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only employers can view applicants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application details by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Application details with job and applicant information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 applicant:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Not authorized to view this application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   put:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Applied, In Interview, Rejected, Hired]
 *                 description: New application status
 *                 example: "In Interview"
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Application status updated successfully"
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid status or application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only employers can update application status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name
 *                 example: "John Doe"
 *               avatar:
 *                 type: string
 *                 description: Avatar URL
 *                 example: "http://localhost:8000/uploads/avatar.jpg"
 *               resume:
 *                 type: string
 *                 description: Resume URL
 *                 example: "http://localhost:8000/uploads/resume.pdf"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of skills
 *                 example: ["JavaScript", "React", "Node.js"]
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     degree:
 *                       type: string
 *                     institution:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     issuingOrganization:
 *                       type: string
 *                     issueDate:
 *                       type: string
 *                       format: date
 *                     expirationDate:
 *                       type: string
 *                       format: date
 *               companyName:
 *                 type: string
 *                 description: Company name (for employers)
 *                 example: "Tech Corp"
 *               companyDescription:
 *                 type: string
 *                 description: Company description (for employers)
 *               companyLogo:
 *                 type: string
 *                 description: Company logo URL (for employers)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/resume:
 *   post:
 *     summary: Delete user's resume
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeUrl
 *             properties:
 *               resumeUrl:
 *                 type: string
 *                 description: URL of the resume to delete
 *                 example: "http://localhost:8000/uploads/resume.pdf"
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Resume deleted successfully"
 *       400:
 *         description: Invalid resume URL or resume not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: New password
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Old password incorrect or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/delete-user/{email}:
 *   delete:
 *     summary: Delete user account (with cascade deletion)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email address
 *         example: "user@example.com"
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully"
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Can only delete own account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get public user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - no token provided
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message to another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - recipientId
 *               - content
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: ID of the related job application
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *               recipientId:
 *                 type: string
 *                 description: ID of the message recipient
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b4"
 *               content:
 *                 type: string
 *                 description: Message content
 *                 example: "Hello, I'd like to schedule an interview."
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *                 messageData:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input or chat only allowed for In Interview status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       404:
 *         description: Application or recipient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/messages/conversation/{applicationId}:
 *   get:
 *     summary: Get conversation messages for a specific job application
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job application ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Conversation messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Not authorized to view this conversation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations with unread message counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       application:
 *                         $ref: '#/components/schemas/Application'
 *                       otherUser:
 *                         $ref: '#/components/schemas/User'
 *                       lastMessage:
 *                         $ref: '#/components/schemas/Message'
 *                       unreadCount:
 *                         type: integer
 *                         description: Number of unread messages in this conversation
 *       401:
 *         description: Unauthorized - no token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get employer analytics and statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data with trends and insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalJobs:
 *                   type: integer
 *                   description: Total number of jobs posted
 *                 activeJobs:
 *                   type: integer
 *                   description: Number of active job postings
 *                 totalApplications:
 *                   type: integer
 *                   description: Total number of applications received
 *                 applicationsByStatus:
 *                   type: object
 *                   properties:
 *                     Applied:
 *                       type: integer
 *                     "In Interview":
 *                       type: integer
 *                     Rejected:
 *                       type: integer
 *                     Hired:
 *                       type: integer
 *                 topSkills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       skill:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 applicationTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       applications:
 *                         type: integer
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only employers can access analytics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/save-jobs/my:
 *   get:
 *     summary: Get all saved jobs for the authenticated user
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved jobs with job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 savedJobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       savedJob:
 *                         $ref: '#/components/schemas/SavedJob'
 *                       job:
 *                         $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized - no token provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/save-jobs/{jobId}:
 *   post:
 *     summary: Save a job to user's favorites
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to save
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       201:
 *         description: Job saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job saved successfully"
 *                 savedJob:
 *                   $ref: '#/components/schemas/SavedJob'
 *       400:
 *         description: Job already saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Remove a job from user's favorites
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to unsave
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Job unsaved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job unsaved successfully"
 *       401:
 *         description: Unauthorized - no token provided
 *       404:
 *         description: Saved job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of registered users
 *                 totalJobs:
 *                   type: integer
 *                   description: Total number of job postings
 *                 totalApplications:
 *                   type: integer
 *                   description: Total number of job applications
 *                 activeJobs:
 *                   type: integer
 *                   description: Number of active job postings
 *                 userGrowth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *                 jobGrowth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with filtering options
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [jobSeeker, employer]
 *         description: Filter by user role
 *         example: "jobSeeker"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email
 *         example: "john"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                   description: Total number of users
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Whether there is a next page
 *                 hasPrevPage:
 *                   type: boolean
 *                   description: Whether there is a previous page
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user details by ID with statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: User details with statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalJobsPosted:
 *                       type: integer
 *                       description: Total jobs posted (for employers)
 *                     totalApplications:
 *                       type: integer
 *                       description: Total applications submitted (for job seekers)
 *                     totalApplicationsReceived:
 *                       type: integer
 *                       description: Total applications received (for employers)
 *                     savedJobs:
 *                       type: integer
 *                       description: Number of jobs saved
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete user account with cascade deletion
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can delete users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: Get all jobs with filtering options
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, closed]
 *         description: Filter by job status
 *         example: "active"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search jobs by title or company
 *         example: "developer"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: List of jobs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 total:
 *                   type: integer
 *                   description: Total number of jobs
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Whether there is a next page
 *                 hasPrevPage:
 *                   type: boolean
 *                   description: Whether there is a previous page
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/jobs/{id}:
 *   delete:
 *     summary: Delete job posting with cascade deletion
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job deleted successfully"
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can delete jobs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/messages/send:
 *   post:
 *     summary: Send message to user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - content
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID of the user to send message to
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *               content:
 *                 type: string
 *                 description: Message content
 *                 example: "Your account has been reviewed and approved."
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *                 messageData:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can send messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Recipient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/messages/conversations:
 *   get:
 *     summary: Get all admin conversations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admin conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       lastMessage:
 *                         $ref: '#/components/schemas/Message'
 *                       unreadCount:
 *                         type: integer
 *                         description: Number of unread messages
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/admin/messages/conversation/{userId}:
 *   get:
 *     summary: Get conversation with specific user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *     responses:
 *       200:
 *         description: Conversation messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Only admins can access this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */