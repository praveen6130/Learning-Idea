import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced with disk
let dbData = null;

const defaultSampleCourse = {
  id: 'course-sample-ai-web',
  title: 'Full-Stack Modern AI Web Applications',
  topic: 'Full-Stack Modern AI Web Applications',
  targetGoal: 'Build & Deploy Autonomous AI-Powered Web Platforms',
  level: 'Comprehensive (Basic to Advanced)',
  duration: '18 Hours • 5 Mastery Levels',
  createdAt: new Date().toISOString(),
  createdBy: 'user-host-1',
  description: 'Master web development from core HTML/CSS/JavaScript foundations to building complex React architectures, backend APIs, and integrating cutting-edge LLMs and AI Agents.',
  levels: [
    {
      levelNumber: 1,
      levelTitle: 'Stage 1: Core Fundamentals (Basic)',
      description: 'Master the core building blocks of the web, client-server models, and programming syntax.',
      badge: 'Beginner Foundations',
      modules: [
        {
          id: 'mod-1',
          title: 'Web Architecture & Modern JavaScript Essentials',
          estimatedTime: '2.5 hrs',
          lessons: [
            {
              id: 'les-1-1',
              title: 'How Web Browsers & Client-Server Systems Really Work',
              duration: '12 min',
              summary: 'Understand HTTP/HTTPS, DNS lookups, DOM rendering cycles, and REST requests.',
              visualType: 'architecture_diagram',
              keyConcepts: ['HTTP Protocol', 'DOM Tree', 'Event Loop', 'Request/Response Cycle']
            },
            {
              id: 'les-1-2',
              title: 'Modern Asynchronous JavaScript & Promises',
              duration: '15 min',
              summary: 'Master async/await, callback queues, microtasks, and error-handling patterns.',
              visualType: 'code_walkthrough',
              keyConcepts: ['Promises', 'async/await', 'Event Loop', 'Fetch API']
            }
          ]
        }
      ]
    },
    {
      levelNumber: 2,
      levelTitle: 'Stage 2: Frontend Engineering & React Core (Elementary)',
      description: 'Construct responsive single-page web applications with state synchronization and component composition.',
      badge: 'Interactive UI Craftsman',
      modules: [
        {
          id: 'mod-2',
          title: 'React Fundamentals & Reactive State',
          estimatedTime: '3.5 hrs',
          lessons: [
            {
              id: 'les-2-1',
              title: 'Declarative UI, JSX, and Component Hierarchies',
              duration: '14 min',
              summary: 'Breaking design mockups into reusable component trees with strict unidirectional data flow.',
              visualType: 'concept_blueprint',
              keyConcepts: ['JSX Virtual DOM', 'Props', 'Component Trees', 'Pure Functions']
            },
            {
              id: 'les-2-2',
              title: 'State Management with Hooks (useState & useEffect)',
              duration: '18 min',
              summary: 'Managing lifecycle side-effects, synchronization, cleanups, and avoiding infinite loops.',
              visualType: 'code_walkthrough',
              keyConcepts: ['useState', 'useEffect Dependency Arrays', 'Custom Hooks']
            }
          ]
        }
      ]
    },
    {
      levelNumber: 3,
      levelTitle: 'Stage 3: Scalable Backend & Real-Time APIs (Intermediate)',
      description: 'Architecting robust Node.js and Express REST & WebSocket backends with persistent datastores.',
      badge: 'Fullstack Integrator',
      modules: [
        {
          id: 'mod-3',
          title: 'RESTful API Engineering & Secure Auth',
          estimatedTime: '4 hrs',
          lessons: [
            {
              id: 'les-3-1',
              title: 'Designing Clean REST APIs with Node & Express',
              duration: '16 min',
              summary: 'Routing, middleware pipelines, error handling, and request validation.',
              visualType: 'architecture_diagram',
              keyConcepts: ['Express Middleware', 'CRUD Routing', 'Status Codes', 'Input Validation']
            },
            {
              id: 'les-3-2',
              title: 'JWT Token Security & Role-Based Access Control',
              duration: '15 min',
              summary: 'Implementing cryptographic tokens, password hashing with bcrypt, and protected routes.',
              visualType: 'security_matrix',
              keyConcepts: ['JWT Signature', 'Bcrypt Hashing', 'Auth Guards', 'Session Security']
            }
          ]
        }
      ]
    },
    {
      levelNumber: 4,
      levelTitle: 'Stage 4: AI & LLM Systems Integration (Advanced)',
      description: 'Integrating multimodal AI, embeddings, streaming tokens, and agentic tool-use into web apps.',
      badge: 'AI Systems Architect',
      modules: [
        {
          id: 'mod-4',
          title: 'Generative AI Pipelines & Streaming UI',
          estimatedTime: '4.5 hrs',
          lessons: [
            {
              id: 'les-4-1',
              title: 'Server-Sent Events & Real-time AI Token Streaming',
              duration: '20 min',
              summary: 'Streaming chunked AI completions directly to the frontend for sub-second user responses.',
              visualType: 'code_walkthrough',
              keyConcepts: ['Server-Sent Events', 'ReadableStreams', 'Prompt Templating', 'Latency Optimization']
            },
            {
              id: 'les-4-2',
              title: 'Autonomous Function Calling & Agentic Workflows',
              duration: '22 min',
              summary: 'Equipping LLMs with structured schemas to call backend APIs and perform automated actions.',
              visualType: 'algorithm_flowchart',
              keyConcepts: ['Tool Calling', 'JSON Schema', 'Agent Loops', 'Validation Guards']
            }
          ]
        }
      ]
    },
    {
      levelNumber: 5,
      levelTitle: 'Stage 5: Production Deployment & Capstone (Mastery)',
      description: 'Hardening security, CI/CD pipeline automation, edge caching, and launching complete AI applications.',
      badge: 'Production Master',
      modules: [
        {
          id: 'mod-5',
          title: 'Production Readiness & Real-World Capstone',
          estimatedTime: '3.5 hrs',
          lessons: [
            {
              id: 'les-5-1',
              title: 'Deploying High-Availability Full-Stack AI Services',
              duration: '18 min',
              summary: 'Containerization, environment configuration, rate limiting, and observability.',
              visualType: 'architecture_diagram',
              keyConcepts: ['Dockerization', 'Rate Limiting', 'Cost Telemetry', 'Cloud Deployments']
            }
          ]
        }
      ]
    }
  ]
};

const defaultInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  return {
    users: [
      {
        id: 'user-host-1',
        name: 'Platform Host (You)',
        email: 'host@learningidea.com',
        phoneNumber: '+1 555-010-0001',
        passwordHash: bcrypt.hashSync('host123', salt),
        role: 'host', // host has supreme admin privileges
        status: 'approved',
        createdAt: new Date().toISOString(),
        bio: 'Platform Host & Super Administrator with full approval authority.',
        assignedCourses: ['course-sample-ai-web']
      },
      {
        id: 'user-admin-1',
        name: 'Lead Instructor Elena',
        email: 'elena.instructor@learningidea.com',
        phoneNumber: '+1 555-010-0002',
        passwordHash: bcrypt.hashSync('admin123', salt),
        role: 'admin',
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        bio: 'Senior AI Curriculum Designer',
        assignedCourses: ['course-sample-ai-web']
      },
      {
        id: 'user-student-1',
        name: 'Alex Chen',
        email: 'alex.student@learningidea.com',
        phoneNumber: '+1 555-010-0003',
        passwordHash: bcrypt.hashSync('student123', salt),
        role: 'student',
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        bio: 'Fullstack learner building portfolio projects',
        assignedCourses: ['course-sample-ai-web']
      },
      {
        id: 'user-student-2',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@learningidea.com',
        phoneNumber: '+1 555-010-0004',
        passwordHash: bcrypt.hashSync('student123', salt),
        role: 'student',
        status: 'pending', // Waiting for host or admin approval!
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        bio: 'University student hoping to learn Python & AI from basic to advanced.',
        assignedCourses: []
      },
      {
        id: 'user-admin-2',
        name: 'Dr. Marcus Vance',
        email: 'marcus.vance@learningidea.com',
        phoneNumber: '+1 555-010-0005',
        passwordHash: bcrypt.hashSync('admin123', salt),
        role: 'admin', // Requesting Admin access (Approved ONLY by Host)
        status: 'pending', // Waiting for host approval!
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        bio: 'Applied Scientist requesting Admin instructor credentials.',
        assignedCourses: []
      }
    ],
    courses: [defaultSampleCourse],
    progress: [
      {
        userId: 'user-student-1',
        courseId: 'course-sample-ai-web',
        completedLessons: ['les-1-1'],
        lastAccessedLesson: 'les-1-2',
        quizScores: { 'les-1-1': 100 },
        updatedAt: new Date().toISOString()
      }
    ],
    generatedVideos: {},
    settings: {
      geminiApiKey: process.env.GEMINI_API_KEY || '',
      requireApproval: true,
      allowRegistration: true,
      defaultRoleOnRegister: 'student',
      aiVoice: 'Nova (Warm AI Educator)',
      platformName: 'CognitiveForge AI Learning Hub'
    },
    activityLogs: [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        action: 'USER_REGISTERED',
        details: 'Sarah Jenkins registered and is pending approval.'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        action: 'ADMIN_REQUEST',
        details: 'Dr. Marcus Vance requested Admin role (Only Host can approve).'
      }
    ]
  };
};

function readDb() {
  if (dbData) return dbData;
  if (!fs.existsSync(DB_FILE)) {
    dbData = defaultInitialData();
    writeDb(dbData);
    return dbData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbData = JSON.parse(raw);

    // Ensure users have phone numbers populated
    let modified = false;
    dbData.users.forEach((u) => {
      if (!u.phoneNumber) {
        u.phoneNumber = '+1 555-010-0000';
        modified = true;
      }
    });
    if (modified) {
      writeDb(dbData);
    }

    return dbData;
  } catch (err) {
    console.error('Error reading db.json, re-initializing default data:', err);
    dbData = defaultInitialData();
    writeDb(dbData);
    return dbData;
  }
}

function writeDb(data) {
  dbData = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// User operations
export const getUsers = () => readDb().users;

export const getUserById = (id) => readDb().users.find((u) => u.id === id);

export const getUserByEmail = (email) => {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return readDb().users.find((u) => (u.email || '').trim().toLowerCase() === clean);
};

export const getUserByPhone = (phone) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return readDb().users.find((u) => (u.phoneNumber || '').replace(/\D/g, '') === digits);
};

export const getUserByEmailAndPhone = (email, phone) => {
  if (!email || !phone) return null;
  const cleanEmail = email.trim().toLowerCase();
  const digits = phone.replace(/\D/g, '');
  return readDb().users.find((u) => {
    const uEmail = (u.email || '').trim().toLowerCase();
    const uDigits = (u.phoneNumber || '').replace(/\D/g, '');
    return uEmail === cleanEmail && uDigits === digits;
  });
};

export const createUser = (user) => {
  const db = readDb();
  db.users.push(user);
  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'USER_REGISTERED',
    details: `${user.name} (${user.email}) registered as ${user.role} with phone ${user.phoneNumber}. Status: ${user.status}.`
  });
  writeDb(db);
  return user;
};

export const updateUser = (id, updates) => {
  const db = readDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  db.users[index] = { ...db.users[index], ...updates };
  writeDb(db);
  return db.users[index];
};

export const deleteUser = (id) => {
  const db = readDb();
  db.users = db.users.filter((u) => u.id !== id);
  writeDb(db);
  return true;
};

// Course operations
export const getCourses = () => readDb().courses;

export const getCourseById = (id) => readDb().courses.find((c) => c.id === id);

export const saveCourse = (course) => {
  const db = readDb();
  const idx = db.courses.findIndex((c) => c.id === course.id);
  if (idx >= 0) {
    db.courses[idx] = course;
  } else {
    db.courses.unshift(course);
  }
  writeDb(db);
  return course;
};

// Video cache operations
export const getVideo = (courseId, lessonId) => {
  const key = `${courseId}:${lessonId}`;
  return readDb().generatedVideos[key] || null;
};

export const saveVideo = (courseId, lessonId, videoData) => {
  const db = readDb();
  const key = `${courseId}:${lessonId}`;
  db.generatedVideos[key] = videoData;
  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'VIDEO_GENERATED',
    details: `AI Video generated for lesson: ${videoData.title}`
  });
  writeDb(db);
  return videoData;
};

// Progress operations
export const getProgress = (userId, courseId) => {
  const db = readDb();
  return db.progress.find((p) => p.userId === userId && p.courseId === courseId) || {
    userId,
    courseId,
    completedLessons: [],
    lastAccessedLesson: null,
    quizScores: {},
    updatedAt: new Date().toISOString()
  };
};

export const saveProgress = (userId, courseId, progressData) => {
  const db = readDb();
  const idx = db.progress.findIndex((p) => p.userId === userId && p.courseId === courseId);
  const updated = {
    userId,
    courseId,
    completedLessons: progressData.completedLessons || [],
    lastAccessedLesson: progressData.lastAccessedLesson || null,
    quizScores: progressData.quizScores || {},
    updatedAt: new Date().toISOString()
  };
  if (idx >= 0) {
    db.progress[idx] = updated;
  } else {
    db.progress.push(updated);
  }
  writeDb(db);
  return updated;
};

// Activity logs
export const getLogs = () => readDb().activityLogs.slice(0, 50);

export const logActivity = (action, details) => {
  const db = readDb();
  db.activityLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    details
  });
  writeDb(db);
};

// Settings
export const getSettings = () => readDb().settings;

export const updateSettings = (updates) => {
  const db = readDb();
  db.settings = { ...db.settings, ...updates };
  writeDb(db);
  return db.settings;
};

// Quick stats
export const getStats = () => {
  const db = readDb();
  const totalUsers = db.users.length;
  const approvedStudents = db.users.filter((u) => u.status === 'approved' && u.role === 'student').length;
  const pendingApprovals = db.users.filter((u) => u.status === 'pending').length;
  const totalAdmins = db.users.filter((u) => (u.role === 'admin' || u.role === 'host') && u.status === 'approved').length;
  const totalCourses = db.courses.length;
  const totalVideosGenerated = Object.keys(db.generatedVideos).length;

  return {
    totalUsers,
    approvedStudents,
    pendingApprovals,
    totalAdmins,
    totalCourses,
    totalVideosGenerated
  };
};

// Initialize DB on import
readDb();
