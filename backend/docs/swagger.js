/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [jobSeeker, employer, admin]
 *         avatar:
 *           type: string
 *         resume:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         companyName:
 *           type: string
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         requirements:
 *           type: string
 *         location:
 *           type: string
 *         category:
 *           type: string
 *         type:
 *           type: string
 *           enum: [Full-Time, Part-Time, Internship, Contract]
 *         salaryMin:
 *           type: number
 *         salaryMax:
 *           type: number
 *         isClosed:
 *           type: boolean
 *     Application:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         job:
 *           type: string
 *         applicant:
 *           type: string
 *         status:
 *           type: string
 *           enum: [Applied, In Interview, Rejected, Hired]
 *         cosineSimilarityScore:
 *           type: number
 * 
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Jobs
 *     description: Job management
 *   - name: Applications
 *     description: Application management
 *   - name: Users
 *     description: User profile management
 *   - name: Messages
 *     description: Chat and messaging
 *   - name: Analytics
 *     description: Analytics and statistics
 *   - name: Saved Jobs
 *     description: Saved jobs management
 * 
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [jobSeeker, employer]
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 * 
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 * 
 * /api/auth/getMe:
 *   post:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Not authorized
 * 
 * /api/auth/upload-file:
 *   post:
 *     tags: [Auth]
 *     summary: Upload file (avatar/resume/logo)
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
 *     responses:
 *       200:
 *         description: File uploaded
 *       400:
 *         description: No file uploaded
 * 
 * /api/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get all jobs with filters
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search by job title or company
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Full-Time, Part-Time, Internship, Contract]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: For personalized job matching
 *     responses:
 *       200:
 *         description: List of jobs with ML-based similarity scores
 *   post:
 *     tags: [Jobs]
 *     summary: Create job (Employer only)
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
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               location:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Internship, Contract]
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *     responses:
 *       201:
 *         description: Job created
 *       403:
 *         description: Only employers can post jobs
 * 
 * /api/jobs/get-jobs-employer:
 *   get:
 *     tags: [Jobs]
 *     summary: Get employer's posted jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employer's jobs with application counts
 *       403:
 *         description: Employer only
 * 
 * /api/jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 *   put:
 *     tags: [Jobs]
 *     summary: Update job (Employer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated
 *       403:
 *         description: Not authorized
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete job (Employer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted
 *       403:
 *         description: Not authorized
 * 
 * /api/jobs/{id}/toggle-close:
 *   put:
 *     tags: [Jobs]
 *     summary: Toggle job open/closed status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job status toggled
 * 
 * /api/applications/{jobId}:
 *   post:
 *     tags: [Applications]
 *     summary: Apply to job (Job Seeker only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Application submitted with ML similarity score
 *       400:
 *         description: Already applied
 *       403:
 *         description: Resume required
 * 
 * /api/applications/my:
 *   get:
 *     tags: [Applications]
 *     summary: Get my applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 * 
 * /api/applications/job/{jobId}:
 *   get:
 *     tags: [Applications]
 *     summary: Get applicants for job (Employer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applicants
 *       403:
 *         description: Not authorized
 * 
 * /api/applications/{id}:
 *   get:
 *     tags: [Applications]
 *     summary: Get application by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application details
 *       403:
 *         description: Not authorized
 * 
 * /api/applications/{id}/status:
 *   put:
 *     tags: [Applications]
 *     summary: Update application status (Employer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Applied, In Interview, Rejected, Hired]
 *     responses:
 *       200:
 *         description: Status updated
 * 
 * /api/user/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
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
 *               avatar:
 *                 type: string
 *               resume:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: array
 *               education:
 *                 type: array
 *               certifications:
 *                 type: array
 *               companyName:
 *                 type: string
 *               companyDescription:
 *                 type: string
 *               companyLogo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 * 
 * /api/user/resume:
 *   post:
 *     tags: [Users]
 *     summary: Delete resume
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resume deleted
 * 
 * /api/user/change-password:
 *   post:
 *     tags: [Users]
 *     summary: Change password
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
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       401:
 *         description: Old password incorrect
 * 
 * /api/user/delete-user/{email}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted
 *       403:
 *         description: Can only delete own account
 * 
 * /api/user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get public user profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 * 
 * /api/messages/send:
 *   post:
 *     tags: [Messages]
 *     summary: Send message
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
 *               recipientId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 *       403:
 *         description: Chat only for In Interview status
 * 
 * /api/messages/conversation/{applicationId}:
 *   get:
 *     tags: [Messages]
 *     summary: Get conversation messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation messages
 *       403:
 *         description: Not authorized
 * 
 * /api/messages/conversations:
 *   get:
 *     tags: [Messages]
 *     summary: Get all conversations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations with unread counts
 * 
 * /api/analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: Get employer analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data with trends
 *       403:
 *         description: Employer only
 * 
 * /api/save-jobs/my:
 *   get:
 *     tags: [Saved Jobs]
 *     summary: Get my saved jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved jobs
 * 
 * /api/save-jobs/{jobId}:
 *   post:
 *     tags: [Saved Jobs]
 *     summary: Save a job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Job saved
 *       400:
 *         description: Already saved
 *   delete:
 *     tags: [Saved Jobs]
 *     summary: Unsave a job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job unsaved
 */
