/**
 * Database Seed Script
 * Generates test data for the SkillMatch platform
 *
 * Usage: npm run seed
 */

import pool from '../src/configs/db.js';
import bcrypt from 'bcrypt';

// =============================================================================
// Test Data Definitions
// =============================================================================

const skills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
  'Java', 'C++', 'Go', 'Rust', 'Swift',
  'UI/UX Design', 'Graphic Design', 'Figma', 'Adobe XD', 'Photoshop',
  'Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'SQL',
  'AWS', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD',
  'Product Management', 'Agile', 'Scrum', 'Project Management', 'Leadership'
];

const interests = [
  'Web Development', 'Mobile Apps', 'AI/ML', 'Cloud Computing', 'Cybersecurity',
  'Game Development', 'Blockchain', 'IoT', 'AR/VR', 'Data Analytics',
  'Startups', 'Open Source', 'Education Tech', 'Health Tech', 'FinTech',
  'Music', 'Photography', 'Writing', 'Public Speaking', 'Networking'
];

const users = [
  { fullName: 'Alice Chen', email: 'alice@example.com', bio: 'Full-stack developer passionate about React and Node.js' },
  { fullName: 'Bob Smith', email: 'bob@example.com', bio: 'ML engineer with expertise in computer vision' },
  { fullName: 'Carol Wang', email: 'carol@example.com', bio: 'Product designer creating delightful user experiences' },
  { fullName: 'David Kim', email: 'david@example.com', bio: 'DevOps specialist automating everything' },
  { fullName: 'Emma Johnson', email: 'emma@example.com', bio: 'Backend developer who loves distributed systems' },
  { fullName: 'Frank Liu', email: 'frank@example.com', bio: 'Mobile developer building iOS and Android apps' },
  { fullName: 'Grace Lee', email: 'grace@example.com', bio: 'Data scientist turning data into insights' },
  { fullName: 'Henry Zhang', email: 'henry@example.com', bio: 'Security researcher and ethical hacker' },
  { fullName: 'Ivy Brown', email: 'ivy@example.com', bio: 'Frontend specialist with an eye for animations' },
  { fullName: 'Jack Wilson', email: 'jack@example.com', bio: 'Tech lead mentoring junior developers' }
];

const projects = [
  {
    title: 'AI-Powered Study Buddy',
    description: 'Building an intelligent tutoring system that adapts to student learning patterns using machine learning. Looking for ML engineers and frontend developers.',
    skills: ['Python', 'TensorFlow', 'React', 'Node.js'],
    category: 'Education Tech'
  },
  {
    title: 'Sustainable Food Delivery App',
    description: 'Mobile app connecting local farmers with consumers to reduce food waste. Need mobile developers and UI/UX designers.',
    skills: ['React', 'Node.js', 'UI/UX Design', 'AWS'],
    category: 'Sustainability'
  },
  {
    title: 'Open Source Portfolio Builder',
    description: 'A tool that automatically generates beautiful portfolios from GitHub profiles. Seeking frontend devs and designers.',
    skills: ['TypeScript', 'React', 'Figma', 'GraphQL'],
    category: 'Developer Tools'
  },
  {
    title: 'Mental Health Companion Bot',
    description: 'Chatbot providing mental health support and resources using NLP. Looking for Python developers and UX researchers.',
    skills: ['Python', 'Machine Learning', 'Node.js', 'UI/UX Design'],
    category: 'Health Tech'
  },
  {
    title: 'Decentralized Voting Platform',
    description: 'Blockchain-based voting system for community decisions. Need blockchain developers and security experts.',
    skills: ['Rust', 'TypeScript', 'React', 'Cybersecurity'],
    category: 'Blockchain'
  },
  {
    title: 'AR Campus Navigator',
    description: 'Augmented reality app to help new students navigate campus. Looking for mobile devs and 3D designers.',
    skills: ['Swift', 'Unity', 'UI/UX Design', 'C++'],
    category: 'AR/VR'
  },
  {
    title: 'Code Review AI Assistant',
    description: 'AI tool that provides intelligent code review suggestions. Seeking ML engineers and senior developers.',
    skills: ['Python', 'Machine Learning', 'JavaScript', 'DevOps'],
    category: 'Developer Tools'
  },
  {
    title: 'Community Event Platform',
    description: 'Platform for organizing and discovering local tech meetups and hackathons. Need full-stack developers.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    category: 'Community'
  },
  {
    title: 'Personal Finance Tracker',
    description: 'Smart budgeting app with expense categorization using ML. Looking for mobile and backend developers.',
    skills: ['React', 'Python', 'Data Science', 'Swift'],
    category: 'FinTech'
  },
  {
    title: 'Collaborative Music Studio',
    description: 'Real-time collaborative music creation platform. Need audio engineers and web developers.',
    skills: ['JavaScript', 'WebAudio', 'React', 'Node.js'],
    category: 'Music Tech'
  },
  {
    title: 'Smart Home Energy Monitor',
    description: 'IoT dashboard for monitoring and optimizing home energy usage. Seeking embedded systems and web devs.',
    skills: ['Python', 'React', 'IoT', 'Data Analytics'],
    category: 'IoT'
  },
  {
    title: 'Language Learning Game',
    description: 'Gamified language learning app with speech recognition. Need game developers and ML engineers.',
    skills: ['Unity', 'Python', 'Machine Learning', 'UI/UX Design'],
    category: 'Education Tech'
  },
  {
    title: 'Freelancer Project Matcher',
    description: 'AI-powered platform matching freelancers with projects based on skills. Looking for full-stack devs.',
    skills: ['TypeScript', 'React', 'Node.js', 'Machine Learning'],
    category: 'Marketplace'
  },
  {
    title: 'Accessibility Testing Tool',
    description: 'Automated tool for testing web accessibility compliance. Need frontend experts and QA engineers.',
    skills: ['JavaScript', 'React', 'Testing', 'UI/UX Design'],
    category: 'Developer Tools'
  },
  {
    title: 'Carbon Footprint Calculator',
    description: 'App that tracks and suggests ways to reduce personal carbon footprint. Seeking data scientists and mobile devs.',
    skills: ['React', 'Python', 'Data Science', 'Node.js'],
    category: 'Sustainability'
  },
  {
    title: 'Virtual Study Room',
    description: 'Video platform for study groups with Pomodoro timer and focus features. Need WebRTC and frontend devs.',
    skills: ['JavaScript', 'WebRTC', 'React', 'Node.js'],
    category: 'Education Tech'
  },
  {
    title: 'Recipe Sharing Social Network',
    description: 'Social platform for sharing and discovering recipes with nutritional analysis. Looking for full-stack developers.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'UI/UX Design'],
    category: 'Social'
  },
  {
    title: 'Job Interview Simulator',
    description: 'AI-powered mock interview platform with feedback. Seeking ML engineers and frontend developers.',
    skills: ['Python', 'Machine Learning', 'React', 'Node.js'],
    category: 'Career'
  },
  {
    title: 'Local Business Discovery App',
    description: 'Platform helping users discover and support local businesses. Need mobile and backend developers.',
    skills: ['React', 'Node.js', 'Maps API', 'PostgreSQL'],
    category: 'Local'
  },
  {
    title: 'Team Mood Tracker',
    description: 'Dashboard for tracking team morale and wellbeing in remote teams. Looking for full-stack devs and designers.',
    skills: ['TypeScript', 'React', 'Node.js', 'UI/UX Design'],
    category: 'Productivity'
  }
];

// =============================================================================
// Seed Functions
// =============================================================================

async function clearDatabase() {
  console.log('Clearing existing data...');

  // Delete in order respecting foreign keys
  await pool.query('DELETE FROM "post_member"');
  await pool.query('DELETE FROM "message"');
  await pool.query('DELETE FROM "userInterest"');
  await pool.query('DELETE FROM "userSkill"');
  await pool.query('DELETE FROM "post"');
  await pool.query('DELETE FROM "interest"');
  await pool.query('DELETE FROM "skill"');
  await pool.query('DELETE FROM "user"');

  console.log('Database cleared.');
}

async function seedSkills() {
  console.log('Seeding skills...');

  for (const skillTitle of skills) {
    await pool.query(
      'INSERT INTO "skill" ("skillTitle") VALUES ($1) ON CONFLICT DO NOTHING',
      [skillTitle]
    );
  }

  const result = await pool.query('SELECT COUNT(*) FROM "skill"');
  console.log(`  Created ${result.rows[0].count} skills`);
}

async function seedInterests() {
  console.log('Seeding interests...');

  for (const interestTitle of interests) {
    await pool.query(
      'INSERT INTO "interest" ("interestTitle") VALUES ($1) ON CONFLICT DO NOTHING',
      [interestTitle]
    );
  }

  const result = await pool.query('SELECT COUNT(*) FROM "interest"');
  console.log(`  Created ${result.rows[0].count} interests`);
}

async function seedUsers() {
  console.log('Seeding users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const user of users) {
    const username = user.email.split('@')[0]; // Generate username from email
    await pool.query(
      `INSERT INTO "user" ("username", "fullName", "email", "password", "bio", "isVerify", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
       ON CONFLICT ("email") DO NOTHING`,
      [username, user.fullName, user.email, hashedPassword, user.bio]
    );
  }

  const result = await pool.query('SELECT COUNT(*) FROM "user"');
  console.log(`  Created ${result.rows[0].count} users`);
}

async function seedUserSkills() {
  console.log('Seeding user skills...');

  const usersResult = await pool.query('SELECT id FROM "user"');
  const skillsResult = await pool.query('SELECT id, "skillTitle" FROM "skill"');

  const skillMap = {};
  skillsResult.rows.forEach(s => skillMap[s.skillTitle] = s.id);

  let count = 0;
  for (const user of usersResult.rows) {
    // Each user gets 3-6 random skills
    const numSkills = 3 + Math.floor(Math.random() * 4);
    const shuffled = [...skills].sort(() => 0.5 - Math.random());
    const userSkills = shuffled.slice(0, numSkills);

    for (const skill of userSkills) {
      if (skillMap[skill]) {
        await pool.query(
          `INSERT INTO "userSkill" ("userId", "skillId", "description")
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [user.id, skillMap[skill], `Experienced in ${skill}`]
        );
        count++;
      }
    }
  }

  console.log(`  Created ${count} user-skill associations`);
}

async function seedUserInterests() {
  console.log('Seeding user interests...');

  const usersResult = await pool.query('SELECT id FROM "user"');
  const interestsResult = await pool.query('SELECT id, "interestTitle" FROM "interest"');

  const interestMap = {};
  interestsResult.rows.forEach(i => interestMap[i.interestTitle] = i.id);

  const levels = ['High', 'Medium', 'Low'];
  let count = 0;

  for (const user of usersResult.rows) {
    // Each user gets 2-5 random interests
    const numInterests = 2 + Math.floor(Math.random() * 4);
    const shuffled = [...interests].sort(() => 0.5 - Math.random());
    const userInterests = shuffled.slice(0, numInterests);

    for (const interest of userInterests) {
      if (interestMap[interest]) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        await pool.query(
          `INSERT INTO "userInterest" ("userId", "interestId", "interestLevel")
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [user.id, interestMap[interest], level]
        );
        count++;
      }
    }
  }

  console.log(`  Created ${count} user-interest associations`);
}

async function seedProjects() {
  console.log('Seeding projects...');

  const usersResult = await pool.query('SELECT id FROM "user"');
  const userIds = usersResult.rows.map(u => u.id);

  let count = 0;
  for (const project of projects) {
    // Random author
    const authorId = userIds[Math.floor(Math.random() * userIds.length)];

    // Random date within last 60 days
    const daysAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await pool.query(
      `INSERT INTO "post" ("title", "description", "skills", "authorId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $5)`,
      [
        project.title,
        project.description,
        JSON.stringify(project.skills),
        authorId,
        createdAt
      ]
    );
    count++;
  }

  console.log(`  Created ${count} projects`);
}

async function seedProjectMembers() {
  console.log('Seeding project members...');

  const projectsResult = await pool.query('SELECT id, "authorId" FROM "post"');
  const usersResult = await pool.query('SELECT id FROM "user"');
  const userIds = usersResult.rows.map(u => u.id);

  const roles = ['Developer', 'Designer', 'Project Manager', 'Contributor'];
  const statuses = ['approved', 'pending'];
  let count = 0;

  for (const project of projectsResult.rows) {
    // Each project gets 0-3 additional members (excluding author)
    const numMembers = Math.floor(Math.random() * 4);
    const availableUsers = userIds.filter(id => id !== project.authorId);
    const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
    const members = shuffled.slice(0, numMembers);

    for (const userId of members) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      await pool.query(
        `INSERT INTO "post_member" ("projectId", "userId", "role", "status", "joinedAt")
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT DO NOTHING`,
        [project.id, userId, role, status]
      );
      count++;
    }
  }

  console.log(`  Created ${count} project members`);
}

// =============================================================================
// Main Execution
// =============================================================================

async function seed() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    await clearDatabase();
    await seedSkills();
    await seedInterests();
    await seedUsers();
    await seedUserSkills();
    await seedUserInterests();
    await seedProjects();
    await seedProjectMembers();

    console.log('\n✅ Database seeded successfully!\n');

    // Print summary
    const summary = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM "user") as users,
        (SELECT COUNT(*) FROM "skill") as skills,
        (SELECT COUNT(*) FROM "interest") as interests,
        (SELECT COUNT(*) FROM "post") as projects,
        (SELECT COUNT(*) FROM "userSkill") as user_skills,
        (SELECT COUNT(*) FROM "userInterest") as user_interests
    `);

    console.log('📊 Summary:');
    console.log(`   Users: ${summary.rows[0].users}`);
    console.log(`   Skills: ${summary.rows[0].skills}`);
    console.log(`   Interests: ${summary.rows[0].interests}`);
    console.log(`   Projects: ${summary.rows[0].projects}`);
    console.log(`   User-Skill links: ${summary.rows[0].user_skills}`);
    console.log(`   User-Interest links: ${summary.rows[0].user_interests}`);
    console.log('');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
