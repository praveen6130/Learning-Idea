import { GoogleGenAI } from '@google/genai';
import { getSettings } from '../db.js';

/**
 * Intelligent topic categorizer for rich fallback generation
 */
function inferDomain(topic = '') {
  const t = topic.toLowerCase();
  if (t.includes('python') || t.includes('javascript') || t.includes('react') || t.includes('node') || 
      t.includes('web') || t.includes('code') || t.includes('software') || t.includes('api') || 
      t.includes('database') || t.includes('sql') || t.includes('rust') || t.includes('golang') ||
      t.includes('frontend') || t.includes('backend') || t.includes('fullstack') || t.includes('app')) {
    return 'software_engineering';
  }
  if (t.includes('machine learning') || t.includes('ai') || t.includes('deep learning') || 
      t.includes('llm') || t.includes('data science') || t.includes('nlp') || t.includes('neural')) {
    return 'artificial_intelligence';
  }
  if (t.includes('security') || t.includes('hacking') || t.includes('crypto') || t.includes('network') || t.includes('cloud') || t.includes('devops') || t.includes('docker') || t.includes('kubernetes')) {
    return 'cloud_security';
  }
  if (t.includes('design') || t.includes('ui') || t.includes('ux') || t.includes('figma') || t.includes('3d') || t.includes('blender') || t.includes('graphic')) {
    return 'creative_design';
  }
  if (t.includes('business') || t.includes('marketing') || t.includes('finance') || t.includes('sales') || t.includes('startup') || t.includes('product')) {
    return 'business_strategy';
  }
  return 'general_mastery';
}

/**
 * Generates dynamic roadmap for any topic with deep sub-contents covering:
 * - Basic Track (Starting to Ending of all basics)
 * - Main Body Track (Core Implementation & Architecture)
 * - Master Track (Advanced Systems, Hardening & Capstone)
 */
function generateDynamicFallbackRoadmap(topic, goal = 'Comprehensive Mastery') {
  const domain = inferDomain(topic);
  const cleanTitle = topic.charAt(0).toUpperCase() + topic.slice(1);

  const levels = [
    {
      levelNumber: 1,
      levelTitle: `Stage 1: Basic Foundations (From Starting to Ending of Basics)`,
      description: `Complete zero-to-hero basics of ${cleanTitle}. Covering every foundational topic from initial setup, mental models, and terminology to writing your first real project.`,
      badge: 'Basic Track (Start to End)',
      trackCategory: 'basic',
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          title: `Starting Point: What is ${cleanTitle} & Environment Setup`,
          estimatedTime: '2.5 Hours',
          subTopicsSummary: ['1.1 Core Definition', '1.2 First Principles', '1.3 Tooling Installation', '1.4 First Run'],
          lessons: [
            {
              id: `les-${Date.now()}-1-1`,
              title: `Absolute Starting Point: What is ${cleanTitle}? Core Mental Model`,
              duration: '12 min',
              summary: `Understand what ${cleanTitle} is, why it matters, and the core intuition behind how it works without confusing jargon.`,
              visualType: 'concept_blueprint',
              trackCategory: 'basic',
              keyConcepts: ['First Principles', 'Visual Mental Model', 'Core Intuition', 'Foundational Glossary'],
              subTopics: [
                'Origin and why it was created',
                'Real-world beginner analogy & mental model',
                'Core terminology every beginner must know',
                'What you can build once you finish this basic stage'
              ]
            },
            {
              id: `les-${Date.now()}-1-2`,
              title: `Workspace & Tooling: Setting Up ${cleanTitle} from Scratch`,
              duration: '15 min',
              summary: `Step-by-step setup walkthrough to get your development environment ready, write your first script, and run it.`,
              visualType: 'code_walkthrough',
              trackCategory: 'basic',
              keyConcepts: ['Workspace Setup', 'CLI & Terminal', 'First Execution', 'Troubleshooting'],
              subTopics: [
                'Prerequisites and installation checklist',
                'Configuring your editor and extensions',
                'Running your very first Hello World execution',
                'Verifying installation and fixing common setup errors'
              ]
            }
          ]
        },
        {
          id: `mod-${Date.now()}-2`,
          title: `Building Blocks: Variables, Data Types & Expressions`,
          estimatedTime: '3 Hours',
          subTopicsSummary: ['2.1 Data Storage', '2.2 Type Systems', '2.3 Operations & Math', '2.4 String Mechanics'],
          lessons: [
            {
              id: `les-${Date.now()}-2-1`,
              title: `Memory, Variables & Primitive Data Types in ${cleanTitle}`,
              duration: '16 min',
              summary: `Learn how variables hold values in memory, different data representations, and how to manipulate values safely.`,
              visualType: 'code_walkthrough',
              trackCategory: 'basic',
              keyConcepts: ['Variables', 'Primitive Types', 'Memory Storage', 'Immutability'],
              subTopics: [
                'Declaring variables and naming conventions',
                'Numbers, text strings, booleans, and null values',
                'The storage container analogy in memory',
                'Common beginner traps when assigning data'
              ]
            },
            {
              id: `les-${Date.now()}-2-2`,
              title: `Logic & Decision Making: Conditionals and Branching`,
              duration: '18 min',
              summary: `Control how your program behaves based on rules, if-else statements, and boolean truth tables.`,
              visualType: 'algorithm_flowchart',
              trackCategory: 'basic',
              keyConcepts: ['If-Else Branching', 'Boolean Algebra', 'Comparison Operators', 'Truthiness'],
              subTopics: [
                'Comparison operators (equals, greater, lesser)',
                'Combining conditions with AND / OR logic',
                'Writing clean if, else-if, and else decision trees',
                'Avoiding nested conditional spaghetti code'
              ]
            }
          ]
        },
        {
          id: `mod-${Date.now()}-3`,
          title: `Ending the Basics: Loops, Functions & First Mini-Project`,
          estimatedTime: '3.5 Hours',
          subTopicsSummary: ['3.1 Loops & Iteration', '3.2 Modular Functions', '3.3 Scope Rules', '3.4 Basic Capstone'],
          lessons: [
            {
              id: `les-${Date.now()}-3-1`,
              title: `Repetition & Automation: Loops, Iteration & Collections`,
              duration: '18 min',
              summary: `Harness computational power by repeating tasks automatically without writing duplicate code.`,
              visualType: 'algorithm_flowchart',
              trackCategory: 'basic',
              keyConcepts: ['For Loops', 'While Loops', 'Array Iteration', 'Break & Continue'],
              subTopics: [
                'The mechanics of counting and repeating',
                'Iterating through lists and collections',
                'Preventing dangerous infinite loops',
                'Practical exercises in repetitive data transformation'
              ]
            },
            {
              id: `les-${Date.now()}-3-2`,
              title: `Ending the Basics Capstone: Modular Functions & First Real Project`,
              duration: '22 min',
              summary: `Bring all basic knowledge together to build your first functioning, complete application from start to finish.`,
              visualType: 'code_walkthrough',
              trackCategory: 'basic',
              keyConcepts: ['Function Anatomy', 'Parameter Passing', 'Return Values', 'Basic Capstone'],
              subTopics: [
                'Packaging logic into clean, reusable functions',
                'Understanding local vs global variable scope',
                'Step-by-step assembly of the Basic mini-project',
                'Congratulations & graduation from the Basic Track'
              ]
            }
          ]
        }
      ]
    },
    {
      levelNumber: 2,
      levelTitle: `Stage 2: Main Body - Core Architecture & Implementation`,
      description: `Transitioning into the main body of ${cleanTitle}. Master core implementation patterns, state lifecycles, and component architecture.`,
      badge: 'Main Body Track (Core Implementation)',
      trackCategory: 'main_body',
      modules: [
        {
          id: `mod-${Date.now()}-4`,
          title: `Main Body Mechanisms & Architectural Patterns`,
          estimatedTime: '4 Hours',
          subTopicsSummary: ['4.1 Data Lifecycles', '4.2 Modularity', '4.3 Error Resilience', '4.4 State Sync'],
          lessons: [
            {
              id: `les-${Date.now()}-4-1`,
              title: `Core Architectural Patterns & Structural Conventions`,
              duration: '20 min',
              summary: `Master the main structural patterns used by professional engineers to build scalable codebases.`,
              visualType: 'architecture_diagram',
              trackCategory: 'main_body',
              keyConcepts: ['Separation of Concerns', 'Clean Architecture', 'Encapsulation', 'Design Patterns'],
              subTopics: [
                'Monolithic vs modular code organization',
                'Encapsulating logic into isolated services',
                'Dependency management and clean imports',
                'Design patterns: Factory, Singleton, and Observer'
              ]
            },
            {
              id: `les-${Date.now()}-4-2`,
              title: `Asynchronous Pipelines & External Service Integrations`,
              duration: '22 min',
              summary: `Handle asynchronous data fetching, web APIs, event listeners, and background processing.`,
              visualType: 'code_walkthrough',
              trackCategory: 'main_body',
              keyConcepts: ['Async Workflows', 'Promise Lifecycles', 'API Consumption', 'Error Boundaries'],
              subTopics: [
                'Understanding the asynchronous event loop',
                'Making robust API requests with timeout fallbacks',
                'Graceful error handling and retry mechanisms',
                'Real-time streaming and websocket basics'
              ]
            }
          ]
        }
      ]
    },
    {
      levelNumber: 3,
      levelTitle: `Stage 3: Main Body - Full System Integration & State Management`,
      description: `The heart of ${cleanTitle}. Connect frontend interfaces, backend datastores, and complex synchronized state pipelines.`,
      badge: 'Main Body Track (Full Integration)',
      trackCategory: 'main_body',
      modules: [
        {
          id: `mod-${Date.now()}-5`,
          title: `Advanced State Lifecycles & Relational Data Engineering`,
          estimatedTime: '4.5 Hours',
          subTopicsSummary: ['5.1 State Trees', '5.2 Persistence', '5.3 Caching Layers', '5.4 Security Guards'],
          lessons: [
            {
              id: `les-${Date.now()}-5-1`,
              title: `Global State Management & Unidirectional Data Flow`,
              duration: '24 min',
              summary: `Build predictable, debuggable state architectures that eliminate race conditions across your system.`,
              visualType: 'algorithm_flowchart',
              trackCategory: 'main_body',
              keyConcepts: ['Unidirectional Flow', 'Immutability', 'State Machines', 'Action Pipelines'],
              subTopics: [
                'The dangers of two-way state drift',
                'Designing predictable state reducers and stores',
                'Optimistic UI updates with rollback protection',
                'Profiling state re-renders and memory footprints'
              ]
            }
          ]
        }
      ]
    },
    {
      levelNumber: 4,
      levelTitle: `Stage 4: Master Level - High Scale, Internals & Zero-Trust Security`,
      description: `Enter the elite Master tier. Dive under the hood into compiler and runtime internals, micro-optimizations, and enterprise security.`,
      badge: 'Master Track (Deep Internals)',
      trackCategory: 'master',
      modules: [
        {
          id: `mod-${Date.now()}-6`,
          title: `Engine Internals, Memory Profiling & High Concurrency`,
          estimatedTime: '5 Hours',
          subTopicsSummary: ['6.1 Runtime Engine', '6.2 Garbage Collection', '6.3 Concurrency', '6.4 Zero-Trust'],
          lessons: [
            {
              id: `les-${Date.now()}-6-1`,
              title: `Under the Hood: Engine Internals & Micro-Benchmark Optimization`,
              duration: '26 min',
              summary: `Uncover the low-level virtual machine, memory allocation, and profiling techniques to achieve 10x throughput.`,
              visualType: 'architecture_diagram',
              trackCategory: 'master',
              keyConcepts: ['Engine Internals', 'Garbage Collection Tuning', 'Flame Graphs', 'Throughput Optimization'],
              subTopics: [
                'How the underlying runtime compiles and executes your code',
                'Diagnosing memory leaks with heap snapshots and flame graphs',
                'Lock-free algorithms and parallel worker threads',
                'Benchmarking latency at the 99th percentile (p99)'
              ]
            },
            {
              id: `les-${Date.now()}-6-2`,
              title: `Zero-Trust Security, Vulnerability Defense & Cryptographic Hardening`,
              duration: '25 min',
              summary: `Protect production systems against injection exploits, token hijacking, and unauthorized privilege escalation.`,
              visualType: 'security_matrix',
              trackCategory: 'master',
              keyConcepts: ['Zero Trust', 'Cryptographic Signatures', 'Input Sanitization', 'Pen-Testing'],
              subTopics: [
                'Threat modeling and common vulnerability vectors (OWASP)',
                'Cryptographic token generation and tamper-proof signatures',
                'Rate limiting, DDOS mitigation, and IP filtering',
                'Automated security scanning in CI/CD pipelines'
              ]
            }
          ]
        }
      ]
    },
    {
      levelNumber: 5,
      levelTitle: `Stage 5: Master Level - Production Deployment & Grand Capstone`,
      description: `The ultimate capstone. Deploy a portfolio-grade, enterprise-scale production project with global edge caching, CI/CD, and live telemetry.`,
      badge: 'Master Track (Production Capstone)',
      trackCategory: 'master',
      modules: [
        {
          id: `mod-${Date.now()}-7`,
          title: `Enterprise Production Capstone & Global Deployment`,
          estimatedTime: '5.5 Hours',
          subTopicsSummary: ['7.1 Docker Containers', '7.2 CI/CD Automation', '7.3 Live Observability', '7.4 Grand Showcase'],
          lessons: [
            {
              id: `les-${Date.now()}-7-1`,
              title: `Architecting the Flagship Master Capstone in ${cleanTitle}`,
              duration: '28 min',
              summary: `Architect and construct an autonomous, real-world flagship project demonstrating complete mastery from basic to expert.`,
              visualType: 'architecture_diagram',
              trackCategory: 'master',
              keyConcepts: ['System Design Blueprint', 'Microservices', 'Resilient DB Clustering', 'Master Capstone'],
              subTopics: [
                'Writing a production System Architecture Document',
                'Multi-tier service decoupling and containerization',
                'Automated testing suites: Unit, Integration & E2E',
                'Deploying to scalable cloud infrastructure with zero downtime'
              ]
            }
          ]
        }
      ]
    }
  ];

  return {
    id: `course-${Date.now()}`,
    title: `${cleanTitle} (Basic to Advanced Masterclass)`,
    topic: cleanTitle,
    targetGoal: goal,
    level: 'Comprehensive (Basic to Advanced)',
    duration: '24 Hours • 5 Mastery Levels',
    createdAt: new Date().toISOString(),
    description: `A master-level structured curriculum designed to guide any learner from basic fundamentals to expert-level mastery of ${cleanTitle} using AI-generated visual videos, sub-topic drills, and real-world projects.`,
    levels
  };
}

/**
 * Generate AI Roadmap with Gemini API or dynamic fallback
 */
export async function generateRoadmap({ topic, targetGoal = 'Complete Skill Mastery', userId = 'system' }) {
  const settings = getSettings();
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a world-class educational curriculum architect and AI university director.
Create a comprehensive, structured course roadmap for the following topic:
TOPIC: "${topic}"
LEARNER GOAL: "${targetGoal}"

The roadmap MUST have deep sub-contents covering:
1. Basic Track: All starting to ending basic topics (zero to hero fundamentals, setup, core building blocks, variables, loops, and first mini-project).
2. Main Body Track: Core architectural patterns, data flow, APIs, and state integration.
3. Master Track: Deep runtime internals, security hardening, high scale, and production capstone.

Return strictly valid JSON matching this schema:
{
  "title": "Course Title",
  "topic": "${topic}",
  "targetGoal": "${targetGoal}",
  "level": "Comprehensive (Basic to Advanced)",
  "duration": "20-28 Hours",
  "description": "2-3 sentence overview",
  "levels": [
    {
      "levelNumber": 1,
      "levelTitle": "Stage 1: ...",
      "description": "Level description",
      "badge": "Badge Name",
      "trackCategory": "basic or main_body or master",
      "modules": [
        {
          "id": "mod-1-1",
          "title": "Module Title",
          "estimatedTime": "2 Hours",
          "subTopicsSummary": ["1.1 Topic", "1.2 Topic"],
          "lessons": [
            {
              "id": "les-1-1-1",
              "title": "Lesson Title",
              "duration": "12 min",
              "summary": "Clear summary",
              "visualType": "code_walkthrough or architecture_diagram or concept_blueprint or algorithm_flowchart",
              "trackCategory": "basic or main_body or master",
              "keyConcepts": ["Concept 1", "Concept 2"],
              "subTopics": ["Sub-topic 1", "Sub-topic 2", "Sub-topic 3"]
            }
          ]
        }
      ]
    }
  ]
}
Do NOT include markdown formatting or backticks around the json. Output pure JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text?.trim() || '';
      const cleanJson = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      parsed.id = `course-${Date.now()}`;
      parsed.createdAt = new Date().toISOString();
      parsed.createdBy = userId;
      return parsed;
    } catch (err) {
      console.warn('Gemini API call skipped or encountered error, using dynamic generative engine:', err.message);
    }
  }

  // Fallback to high-fidelity dynamic generator
  const generated = generateDynamicFallbackRoadmap(topic, targetGoal);
  generated.createdBy = userId;
  return generated;
}
