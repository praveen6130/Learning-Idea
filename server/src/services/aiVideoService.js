import { GoogleGenAI } from '@google/genai';
import { getSettings } from '../db.js';

/**
 * Generates rich code snippets and diagrams based on lesson topic and level
 */
function generateLessonAssets(topic, lessonTitle, levelNumber, trackCategory = 'basic') {
  const t = topic.toLowerCase();
  const l = lessonTitle.toLowerCase();

  let codeSnippet = `// ⚡ Implementation Walkthrough: ${lessonTitle}
import { initializeEngine, executeStep } from '@core/system';

async function runWorkflow() {
  console.log("🚀 Starting module: ${lessonTitle}");
  
  // 1. Initializing core parameters
  const config = {
    target: "${topic}",
    mode: "${trackCategory}",
    timestamp: Date.now()
  };

  // 2. Executing step-by-step logic
  const result = await executeStep(config);
  console.log("✅ Success! Output ready:", result);
  return result;
}

runWorkflow();`;

  let diagramNodes = [
    { id: 'n1', label: '1. Input & Trigger', desc: 'Raw event / data captured', status: 'active' },
    { id: 'n2', label: '2. Transformation Layer', desc: 'Validation & processing', status: 'ready' },
    { id: 'n3', label: '3. Execution Engine', desc: 'State computing & logic', status: 'ready' },
    { id: 'n4', label: '4. Verified Delivery', desc: 'Resilient cached output', status: 'ready' }
  ];

  let metaphor = {
    title: 'The Blueprint Analogy',
    analogy: `Think of learning ${lessonTitle} like assembling the steering wheel of a vehicle. First you learn how it turns, and then you pilot the entire highway!`,
    icon: 'compass'
  };

  if (trackCategory === 'basic' || levelNumber <= 2) {
    metaphor = {
      title: 'Beginner First-Principles Metaphor',
      analogy: `Think of ${lessonTitle} like labeled storage bins in an organized workshop. Each piece has a clear slot, so you never lose track of your work!`,
      icon: 'sparkles'
    };
    codeSnippet = `// 🌱 Foundational Walkthrough: ${lessonTitle}
// Step 1: Declaring our primary values
const skillName = "${topic}";
let progressStage = 1;

// Step 2: Running simple beginner logic
function learnBasics(name, stage) {
  console.log("Welcome to " + name + "!");
  console.log("Currently mastering Stage " + stage + " fundamentals.");
  return { status: "Ready", nextLesson: "${lessonTitle}" };
}

// Step 3: Verifying our first output
const result = learnBasics(skillName, progressStage);
console.log("Result:", result);`;

    diagramNodes = [
      { id: 'n1', label: '1. Concept Origin', desc: 'Why this basic building block exists', status: 'active' },
      { id: 'n2', label: '2. Core Syntax', desc: 'How to write it clearly without errors', status: 'ready' },
      { id: 'n3', label: '3. First Execution', desc: 'Running in your development terminal', status: 'ready' },
      { id: 'n4', label: '4. Mini-Drill', desc: 'Solving your first hands-on problem', status: 'ready' }
    ];
  } else if (trackCategory === 'master' || levelNumber >= 4) {
    metaphor = {
      title: 'High-Throughput Distributed Analogy',
      analogy: `Think of ${lessonTitle} like high-speed rail switches handling 10,000 requests per second with zero collision tolerance and automated failovers!`,
      icon: 'shield'
    };
    codeSnippet = `// 👑 Master Tier Engineering: ${lessonTitle}
import { DistributedCluster, ZeroTrustGate } from '@enterprise/core';

export class HighThroughputEngine {
  private static instance: HighThroughputEngine;
  private readonly cluster = new DistributedCluster({ workers: 8 });

  public async dispatchOptimized(payload: Record<string, unknown>) {
    // Enforce Zero-Trust cryptographic validation
    await ZeroTrustGate.verifySignature(payload);
    
    // Sub-millisecond parallel pipeline execution
    const metricStart = performance.now();
    const result = await this.cluster.executeParallel(payload);
    const latencyMs = performance.now() - metricStart;

    console.log(\`⚡ Processed in \${latencyMs.toFixed(2)}ms (p99 < 5ms)\`);
    return result;
  }
}`;

    diagramNodes = [
      { id: 'n1', label: 'Zero-Trust Gate', desc: 'Cryptographic token validation', status: 'active' },
      { id: 'n2', label: 'Worker Thread Pool', desc: 'Non-blocking parallel dispatch', status: 'ready' },
      { id: 'n3', label: 'Memory Allocation', desc: 'Heap snapshot garbage collection', status: 'ready' },
      { id: 'n4', label: 'Global Edge Cache', desc: 'Sub-5ms global content delivery', status: 'ready' }
    ];
  }

  return { codeSnippet, diagramNodes, metaphor };
}

/**
 * Creates dynamic multi-scene storyboard with synchronized narration
 */
function buildSyntheticStoryboard(topic, lessonTitle, levelNumber = 1, trackCategory = 'basic') {
  const { codeSnippet, diagramNodes, metaphor } = generateLessonAssets(topic, lessonTitle, levelNumber, trackCategory);

  const isBasic = trackCategory === 'basic' || levelNumber <= 2;
  const isMaster = trackCategory === 'master' || levelNumber >= 4;

  const scenes = [
    {
      sceneNumber: 1,
      type: 'hook',
      durationSeconds: 28,
      title: isBasic ? 'Starting Point & Core Concept' : isMaster ? 'Master Architecture & High-Scale Hook' : 'Main Body Core Overview',
      narration: isBasic 
        ? `Welcome to this step-by-step beginner masterclass on ${lessonTitle}! If you are starting from scratch, don't worry. We will break down every single detail from start to finish with simple real-world analogies. By the end of this video, you will have complete confidence in ${topic}. Let's jump right in!`
        : isMaster
        ? `Welcome to the advanced masterclass on ${lessonTitle}. In this deep-dive session, we explore production hardening, engine internals, and enterprise scalability in ${topic}. Let's inspect how elite engineering teams architect this system!`
        : `Welcome to this comprehensive lesson on ${lessonTitle}. In this module, we examine the core mechanics, data lifecycles, and architectural patterns of ${topic}. Let's build something robust together!`,
      visual: {
        headline: lessonTitle,
        subheadline: `Course: ${topic} • ${isBasic ? 'Basic Foundations Track' : isMaster ? 'Master Tier Track' : 'Main Body Track'}`,
        points: isBasic ? [
          `Clear beginner intuition without confusing jargon`,
          `Visual real-world analogy & mental model`,
          `Hands-on guided walkthrough from start to finish`
        ] : isMaster ? [
          `High-scale architecture & memory models`,
          `Zero-trust security and threat guardrails`,
          `Benchmarked code patterns for sub-5ms latency`
        ] : [
          `Modular component architecture & separation of concerns`,
          `Asynchronous pipelines & resilient state flow`,
          `Production patterns ready for enterprise scale`
        ],
        badgeText: isBasic ? 'Basic Track (Start to End)' : isMaster ? 'Master Tier (Elite Engineering)' : 'Main Body Track (Core Implementation)',
        metaphor: metaphor,
        visualStyle: isBasic ? 'warm_clarity' : isMaster ? 'cyber_matrix' : 'nebula_glow'
      }
    },
    {
      sceneNumber: 2,
      type: 'diagram',
      durationSeconds: 34,
      title: isBasic ? 'Visual Intuition & Mental Model' : 'System Architecture & Data Flow',
      narration: isBasic
        ? `Let's visualize the mental model behind ${lessonTitle}. Look at how information moves step by step: from the initial concept, through the syntax rules, and into your terminal execution. When you understand the flow, programming becomes intuitive rather than memorization!`
        : `Let's inspect the underlying architecture of ${lessonTitle}. Notice how data propagates across the system boundaries: from the initial ingress, through validation layers, and into parallel processing. This decoupled design guarantees high availability and zero bottleneck cascades.`,
      visual: {
        headline: isBasic ? 'Visual Step-by-Step Flow' : 'Distributed System Architecture',
        subheadline: isBasic ? 'How the foundational pieces connect together' : 'End-to-end data pipeline and fault-tolerance',
        diagramNodes: diagramNodes,
        highlightNode: 'n2',
        visualStyle: 'blueprint_grid'
      }
    },
    {
      sceneNumber: 3,
      type: 'code',
      durationSeconds: 42,
      title: isBasic ? 'Hands-on Code & First Execution' : 'Production Implementation & Benchmark',
      narration: isBasic
        ? `Now let's see the actual code in action! Notice how clean and readable each line is. We declare our variables, define our logic, and output the result. Follow along step by step, and try running this in your own editor!`
        : `Now let's examine the production code. Notice our modular structure: strict typing, boundary validation, and zero unhandled rejections. This exact pattern ensures peak throughput and maintainability under heavy traffic.`,
      visual: {
        headline: isBasic ? 'Guided Hands-on Syntax' : 'Enterprise Implementation',
        subheadline: isBasic ? 'Line-by-line beginner explanation' : 'Benchmarked production syntax with profiling',
        code: codeSnippet,
        highlightLines: [3, 4, 10, 11],
        visualStyle: 'dark_ide'
      }
    },
    {
      sceneNumber: 4,
      type: 'tips_and_pitfalls',
      durationSeconds: 30,
      title: isBasic ? 'Beginner Pitfalls to Avoid' : 'Critical Pro-Tips & Edge-Cases',
      narration: isBasic
        ? `Here is what beginners often get stuck on! Beginners frequently miss syntax brackets, misspell variable names, or forget to save their file before running. Keep these key tips in mind, and you will save hours of debugging!`
        : `Here are the critical pro-tips that separate seniors from juniors. Always enforce zero-trust validation at the API boundary, isolate asynchronous state, and benchmark under load to avoid costly cascading downtime.`,
      visual: {
        headline: isBasic ? 'Beginner Traps to Avoid' : 'Pro-Tips & Edge Case Guardrails',
        subheadline: isBasic ? 'Common beginner mistakes and how to fix them' : 'High-impact engineering guidelines',
        doList: isBasic ? [
          'Read error messages carefully—they point directly to the line!',
          'Use clear, descriptive variable and function names',
          'Test small chunks of code frequently instead of all at once'
        ] : [
          'Validate all inputs at the boundary with strict schemas',
          'Implement zero-trust security and rate-limiting buffers',
          'Profile memory allocations with flame graphs and heap snapshots'
        ],
        dontList: isBasic ? [
          'Do NOT panic when you see an error terminal message',
          'Do NOT copy-paste code without understanding what it does',
          'Do NOT skip typing out the code exercises by hand'
        ] : [
          'Do NOT leave unhandled promise rejections or dangling timers',
          'Do NOT hardcode environment secrets in client bundles',
          'Do NOT ignore 99th-percentile (p99) latency spikes'
        ],
        visualStyle: 'matrix_split'
      }
    },
    {
      sceneNumber: 5,
      type: 'recap_and_quiz',
      durationSeconds: 26,
      title: 'Recap, Achievement & Challenge Mission',
      narration: `Outstanding work completing this lesson on ${lessonTitle}! You have taken another major step forward in your ${topic} journey. Now test your knowledge with the challenge quiz below and unlock your achievement badge!`,
      visual: {
        headline: 'Skill Milestone Accomplished! 🎉',
        subheadline: `You have successfully mastered: ${lessonTitle}`,
        trophyText: isBasic ? 'Foundations Stage Unlocked' : isMaster ? 'Master Tier Verified' : 'Core Architecture Unlocked',
        quizPreview: `What is the key takeaway from ${lessonTitle}?`,
        visualStyle: 'celebration_glow'
      }
    }
  ];

  // Calculate total duration and build subtitles
  let cumulativeTime = 0;
  const subtitles = [];

  scenes.forEach((scene) => {
    const startTime = cumulativeTime;
    const endTime = cumulativeTime + scene.durationSeconds;
    cumulativeTime = endTime;

    const words = scene.narration.split(' ');
    const chunkSize = 10;
    const numChunks = Math.ceil(words.length / chunkSize);
    const chunkDuration = scene.durationSeconds / numChunks;

    for (let i = 0; i < numChunks; i++) {
      const chunkText = words.slice(i * chunkSize, (i + 1) * chunkSize).join(' ');
      const subStart = startTime + i * chunkDuration;
      const subEnd = Math.min(endTime, subStart + chunkDuration);
      subtitles.push({
        id: `sub-${scene.sceneNumber}-${i}`,
        sceneNumber: scene.sceneNumber,
        startTime: Math.round(subStart * 10) / 10,
        endTime: Math.round(subEnd * 10) / 10,
        text: chunkText
      });
    }
  });

  return {
    id: `video-${Date.now()}`,
    title: `AI Video: ${lessonTitle}`,
    topic,
    lessonTitle,
    levelNumber,
    trackCategory,
    durationSeconds: cumulativeTime,
    durationFormatted: `${Math.floor(cumulativeTime / 60)}m ${cumulativeTime % 60}s`,
    narratorVoice: 'Nova (Warm AI Educator)',
    scenes,
    subtitles,
    quiz: {
      question: `In ${lessonTitle}, what is the most important principle for building reliable systems?`,
      options: [
        'Understand first principles, validate inputs, and break logic into modular steps',
        'Write all logic in a single file without testing',
        'Bypass error handling to increase raw execution speed',
        'Hardcode configuration parameters directly inside functions'
      ],
      correctAnswerIndex: 0,
      explanation: 'Understanding first principles, validating inputs, and maintaining modularity prevents bugs and ensures clean, scalable code.'
    },
    practiceMission: isBasic 
      ? `Try modifying the code from ${lessonTitle} in the practice playground below. Change the input variables and observe how the output responds!`
      : `Implement the pattern from ${lessonTitle} with input validation and benchmark its latency under simulated network load.`
  };
}

/**
 * Generate AI Video Storyboard with Gemini API or dynamic fallback
 */
export async function generateAIVideo({ courseId, lessonId, topic, lessonTitle, levelNumber = 1, trackCategory = 'basic' }) {
  const settings = getSettings();
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an elite AI Educational Video Producer.
Generate a creative, high-quality, synchronized 5-scene video storyboard with exact voiceover narration scripts for:
TOPIC: "${topic}"
LESSON TITLE: "${lessonTitle}"
LEVEL: Stage ${levelNumber} (${trackCategory})

Requirements:
- 5 Scenes:
  1. "hook" (Creative intro with relatable real-world analogy and key points)
  2. "diagram" (Visual mental model or architecture flow)
  3. "code" (Hands-on code walkthrough with clean syntax)
  4. "tips_and_pitfalls" (DO vs DON'T rules)
  5. "recap_and_quiz" (Celebration & quiz mission)
- Each scene must have an engaging, conversational, educational "narration" text meant for text-to-speech.

Return strictly valid JSON matching this schema:
{
  "title": "AI Video: ${lessonTitle}",
  "topic": "${topic}",
  "lessonTitle": "${lessonTitle}",
  "levelNumber": ${levelNumber},
  "trackCategory": "${trackCategory}",
  "narratorVoice": "Nova (Warm AI Educator)",
  "scenes": [
    {
      "sceneNumber": 1,
      "type": "hook",
      "durationSeconds": 28,
      "title": "Scene Title",
      "narration": "Exact speech text...",
      "visual": {
        "headline": "Heading",
        "subheadline": "Subheading",
        "points": ["Point 1", "Point 2", "Point 3"],
        "badgeText": "Stage ${levelNumber}",
        "visualStyle": "nebula_glow"
      }
    }
  ],
  "quiz": {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Why Option A is correct"
  },
  "practiceMission": "Short hands-on prompt"
}
Output strictly valid JSON. No markdown backticks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      let cumulativeTime = 0;
      const subtitles = [];
      parsed.scenes.forEach((scene) => {
        const startTime = cumulativeTime;
        const dur = scene.durationSeconds || 30;
        const endTime = cumulativeTime + dur;
        cumulativeTime = endTime;

        const words = (scene.narration || '').split(' ');
        const chunkSize = 10;
        const numChunks = Math.max(1, Math.ceil(words.length / chunkSize));
        const chunkDuration = dur / numChunks;

        for (let i = 0; i < numChunks; i++) {
          const chunkText = words.slice(i * chunkSize, (i + 1) * chunkSize).join(' ');
          subtitles.push({
            id: `sub-${scene.sceneNumber}-${i}`,
            sceneNumber: scene.sceneNumber,
            startTime: Math.round((startTime + i * chunkDuration) * 10) / 10,
            endTime: Math.round(Math.min(endTime, startTime + (i + 1) * chunkDuration) * 10) / 10,
            text: chunkText
          });
        }
      });

      parsed.id = `video-${Date.now()}`;
      parsed.courseId = courseId;
      parsed.lessonId = lessonId;
      parsed.durationSeconds = cumulativeTime;
      parsed.durationFormatted = `${Math.floor(cumulativeTime / 60)}m ${cumulativeTime % 60}s`;
      parsed.subtitles = subtitles;
      parsed.trackCategory = trackCategory;

      return parsed;
    } catch (err) {
      console.warn('Gemini video generation error, using synthetic storyboard engine:', err.message);
    }
  }

  // Fallback to high-fidelity dynamic storyboard
  const video = buildSyntheticStoryboard(topic, lessonTitle, levelNumber, trackCategory);
  video.courseId = courseId;
  video.lessonId = lessonId;
  return video;
}
