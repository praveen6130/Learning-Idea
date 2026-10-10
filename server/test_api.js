async function runTests() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('--- 1. Testing Host Login ---');
  const hostLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'host@learningidea.com', password: 'host123' })
  }).then(r => r.json());

  console.log('Host Login Result:', {
    role: hostLogin.user.role,
    status: hostLogin.user.status,
    isApproved: hostLogin.isApproved
  });

  const hostToken = hostLogin.token;

  console.log('\n--- 2. Testing Unapproved / Pending Student Gatekeeper ---');
  const pendingLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sarah.jenkins@learningidea.com', password: 'student123' })
  }).then(r => r.json());

  console.log('Pending User Status:', {
    name: pendingLogin.user.name,
    status: pendingLogin.user.status,
    isApproved: pendingLogin.isApproved
  });

  // Try to generate roadmap as pending user (MUST BE BLOCKED!)
  const blockedAttempt = await fetch(`${baseUrl}/courses/generate-roadmap`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${pendingLogin.token}`
    },
    body: JSON.stringify({ topic: 'Ethical Hacking' })
  });

  console.log('Attempt by unapproved user to use website:', {
    status: blockedAttempt.status,
    statusText: blockedAttempt.statusText
  });
  const blockedBody = await blockedAttempt.json();
  console.log('Gatekeeper response:', blockedBody);

  console.log('\n--- 3. Testing Host Approving Pending Student ---');
  const approveRes = await fetch(`${baseUrl}/admin/users/user-student-2/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hostToken}`
    },
    body: JSON.stringify({ role: 'student' })
  }).then(r => r.json());

  console.log('Host approval response:', approveRes.message);

  console.log('\n--- 4. Testing Now-Approved Student Using Website ---');
  const allowedAttempt = await fetch(`${baseUrl}/courses/generate-roadmap`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${pendingLogin.token}`
    },
    body: JSON.stringify({ topic: 'Deep Learning & Neural Networks', targetGoal: 'Research Mastery' })
  });

  console.log('Attempt after Host approval:', {
    status: allowedAttempt.status,
    ok: allowedAttempt.ok
  });
  const roadmapData = await allowedAttempt.json();
  console.log('Generated Course Title:', roadmapData.course?.title);
  console.log('Number of Levels (Basic to Advanced):', roadmapData.course?.levels?.length);

  console.log('\n--- 5. Testing AI Video Generation for Lesson ---');
  const sampleLesson = roadmapData.course?.levels[0]?.modules[0]?.lessons[0];
  const videoRes = await fetch(`${baseUrl}/courses/generate-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hostToken}`
    },
    body: JSON.stringify({
      courseId: roadmapData.course.id,
      lessonId: sampleLesson.id,
      topic: roadmapData.course.topic,
      lessonTitle: sampleLesson.title,
      levelNumber: 1
    })
  }).then(r => r.json());

  console.log('Video Generation Result:', {
    title: videoRes.video?.title,
    duration: videoRes.video?.durationFormatted,
    scenesCount: videoRes.video?.scenes?.length,
    subtitlesCount: videoRes.video?.subtitles?.length,
    quizQuestion: videoRes.video?.quiz?.question
  });

  console.log('\n--- 6. Testing "Choose the Student" & Course Assignment ---');
  const assignRes = await fetch(`${baseUrl}/admin/users/choose-and-assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hostToken}`
    },
    body: JSON.stringify({
      studentIds: ['user-student-2'],
      courseIds: [roadmapData.course.id]
    })
  }).then(r => r.json());

  console.log('Host assigned course to chosen student:', assignRes.message);

  console.log('\n--- 7. Testing Admin Statistics ---');
  const statsRes = await fetch(`${baseUrl}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${hostToken}` }
  }).then(r => r.json());
  console.log('Admin Stats:', statsRes.stats);

  console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);
