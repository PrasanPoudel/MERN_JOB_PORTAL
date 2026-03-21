const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const { cloudinary } = require('./services/cloudinaryService');

// Connect to database using same config as main app
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017', {
  dbName: 'KaamsetuDB'
});

async function debugCloudinary() {
  try {
    console.log('=== DEBUGGING CLOUDINARY URLS ===\n');

    // Check User URLs
    console.log('1. USER URLs:');
    const users = await User.find({ 
      $or: [
        { avatar: { $exists: true, $ne: null } }, 
        { resume: { $exists: true, $ne: null } }
      ] 
    });
    
    users.forEach(user => {
      if (user.avatar) {
        console.log(`User ${user.name} avatar: ${user.avatar}`);
      }
      if (user.resume) {
        console.log(`User ${user.name} resume: ${user.resume}`);
      }
    });

    // Check Job URLs
    console.log('\n2. JOB LOGOS:');
    const jobs = await Job.find({ companyLogo: { $exists: true, $ne: null } });
    jobs.forEach(job => {
      console.log(`Job ${job.title} logo: ${job.companyLogo}`);
    });

    // Check Application URLs
    console.log('\n3. APPLICATION RESUMES:');
    const apps = await Application.find({ resume: { $exists: true, $ne: null } });
    apps.forEach(app => {
      console.log(`Application resume: ${app.resume}`);
    });

    // Check Cloudinary files
    console.log('\n4. CLOUDINARY FILES:');
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'uploaded_files/',
      max_results: 10
    });
    
    result.resources.forEach(resource => {
      console.log(`Public ID: ${resource.public_id}`);
      console.log(`URL: ${resource.secure_url}`);
      console.log('---');
    });

    // Test public ID extraction
    console.log('\n5. TESTING PUBLIC ID EXTRACTION:');
    const testUrls = [
      ...users.map(u => u.avatar).filter(Boolean),
      ...users.map(u => u.resume).filter(Boolean),
      ...jobs.map(j => j.companyLogo).filter(Boolean),
      ...apps.map(a => a.resume).filter(Boolean)
    ];

    const { extractPublicId } = require('./services/cloudinaryCleanupService');
    
    testUrls.forEach(url => {
      console.log(`\nTesting URL: ${url}`);
      const extracted = extractPublicId(url);
      console.log(`Extracted Public ID: ${extracted}`);
    });

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

debugCloudinary();