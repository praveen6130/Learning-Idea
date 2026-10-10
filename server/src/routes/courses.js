import express from 'express';
import { getCourses, getCourseById, saveCourse, getVideo, saveVideo, getProgress, saveProgress } from '../db.js';
import { authenticateToken, requireApproved } from '../middleware/auth.js';
import { generateRoadmap } from '../services/aiRoadmapService.js';
import { generateAIVideo } from '../services/aiVideoService.js';

const router = express.Router();

// Enforce authentication AND approval!
// If admin or host didn't approve, the user cannot access or use the website!
router.use(authenticateToken);
router.use(requireApproved);

// List all courses
router.get('/all', (req, res) => {
  try {
    const courses = getCourses();
    res.json({ courses });
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch courses' });
  }
});

// Search and generate an AI Roadmap from Basic to Advanced
router.post('/generate-roadmap', async (req, res) => {
  try {
    const { topic, targetGoal } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'TOPIC_REQUIRED', message: 'Please provide a course or skill topic to search.' });
    }

    const cleanTopic = topic.trim();
    const cleanGoal = targetGoal?.trim() || 'Mastery from Basic to Advanced';

    // Generate comprehensive 5-stage roadmap
    const course = await generateRoadmap({
      topic: cleanTopic,
      targetGoal: cleanGoal,
      userId: req.user.id
    });

    // Save to persistent database
    saveCourse(course);

    res.status(201).json({
      message: 'AI Roadmap generated successfully!',
      course
    });
  } catch (err) {
    console.error('Roadmap generation error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to generate course roadmap.' });
  }
});

// Get specific course by ID
router.get('/:id', (req, res) => {
  try {
    const course = getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    }
    res.json({ course });
  } catch (err) {
    console.error('Fetch course error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch course' });
  }
});

// Generate or fetch AI Video for a specific lesson on the roadmap
router.post('/generate-video', async (req, res) => {
  try {
    const { courseId, lessonId, topic, lessonTitle, levelNumber } = req.body;

    if (!courseId || !lessonId || !lessonTitle) {
      return res.status(400).json({ error: 'MISSING_PARAMS', message: 'courseId, lessonId, and lessonTitle are required.' });
    }

    // Check if video already cached/generated
    let existingVideo = getVideo(courseId, lessonId);
    if (existingVideo) {
      return res.json({
        message: 'Loaded pre-generated AI video',
        video: existingVideo,
        cached: true
      });
    }

    // Generate full multi-scene AI video storyboard
    const videoData = await generateAIVideo({
      courseId,
      lessonId,
      topic: topic || 'Mastery Skill',
      lessonTitle,
      levelNumber: levelNumber || 1
    });

    // Save to DB
    saveVideo(courseId, lessonId, videoData);

    res.status(201).json({
      message: 'AI Video generated successfully!',
      video: videoData,
      cached: false
    });
  } catch (err) {
    console.error('Video generation error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to generate AI video' });
  }
});

// Get video for lesson
router.get('/:courseId/video/:lessonId', async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    let video = getVideo(courseId, lessonId);

    if (!video) {
      // Find course and lesson title to generate on the fly
      const course = getCourseById(courseId);
      if (course) {
        let foundLesson = null;
        let foundLevel = 1;
        course.levels.forEach((lvl) => {
          lvl.modules.forEach((mod) => {
            const l = mod.lessons.find((les) => les.id === lessonId);
            if (l) {
              foundLesson = l;
              foundLevel = lvl.levelNumber;
            }
          });
        });

        if (foundLesson) {
          video = await generateAIVideo({
            courseId,
            lessonId,
            topic: course.topic,
            lessonTitle: foundLesson.title,
            levelNumber: foundLevel
          });
          saveVideo(courseId, lessonId, video);
        }
      }
    }

    if (!video) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Video not found or lesson does not exist' });
    }

    res.json({ video });
  } catch (err) {
    console.error('Fetch video error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch video' });
  }
});

// Get user progress for course
router.get('/:courseId/progress', (req, res) => {
  try {
    const progress = getProgress(req.user.id, req.params.courseId);
    res.json({ progress });
  } catch (err) {
    console.error('Fetch progress error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to fetch progress' });
  }
});

// Update user progress
router.post('/:courseId/progress', (req, res) => {
  try {
    const { lessonId, completed, quizScore } = req.body;
    const { courseId } = req.params;

    const currentProgress = getProgress(req.user.id, courseId);
    let completedLessons = [...(currentProgress.completedLessons || [])];

    if (completed && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    } else if (completed === false) {
      completedLessons = completedLessons.filter((id) => id !== lessonId);
    }

    const quizScores = { ...(currentProgress.quizScores || {}) };
    if (quizScore !== undefined && lessonId) {
      quizScores[lessonId] = quizScore;
    }

    const updated = saveProgress(req.user.id, courseId, {
      completedLessons,
      lastAccessedLesson: lessonId || currentProgress.lastAccessedLesson,
      quizScores
    });

    res.json({ message: 'Progress updated', progress: updated });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Failed to update progress' });
  }
});

export default router;
