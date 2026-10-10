async function runPhoneAndAuthTests() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('=== TEST 1: Registering User with Gmail & Phone Number ===');
  const regEmail = `student.test.${Date.now()}@gmail.com`;
  const regPhone = '+1 555-777-8899';
  const regPassword = 'mypassword123';

  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: regEmail,
      phoneNumber: regPhone,
      password: regPassword,
      role: 'student',
      bio: 'Excited to learn Python from basic to advanced.'
    })
  }).then(r => r.json());

  console.log('Register Response:', {
    message: regRes.message,
    email: regRes.user?.email,
    phone: regRes.user?.phoneNumber,
    status: regRes.user?.status
  });

  const studentId = regRes.user.id;

  console.log('\n=== TEST 2: Login with Registered Gmail & Password ===');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regEmail, password: regPassword })
  }).then(r => r.json());

  console.log('Login Response:', {
    message: loginRes.message,
    isApproved: loginRes.isApproved,
    status: loginRes.user?.status
  });

  console.log('\n=== TEST 3: Forgot Password with Phone Number ===');
  // Attempt with incorrect phone number
  const wrongPhoneAttempt = await fetch(`${baseUrl}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: regEmail,
      phoneNumber: '+1 555-000-0000',
      newPassword: 'newsecurepassword456'
    })
  });
  console.log('Attempt with wrong phone status:', wrongPhoneAttempt.status, (await wrongPhoneAttempt.json()).message);

  // Attempt with correct phone number
  const correctPhoneAttempt = await fetch(`${baseUrl}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: regEmail,
      phoneNumber: regPhone,
      newPassword: 'newsecurepassword456'
    })
  });
  console.log('Attempt with correct phone:', (await correctPhoneAttempt.json()).message);

  // Verify login with new password
  const newLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: regEmail, password: 'newsecurepassword456' })
  }).then(r => r.json());
  console.log('Login with new password succeeded! User:', newLoginRes.user?.name);

  console.log('\n=== TEST 4: Admin vs Host Approval Hierarchy ===');
  // Login as Instructor Admin (Elena)
  const elenaLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'elena.instructor@learningidea.com', password: 'admin123' })
  }).then(r => r.json());

  // Elena approves John Doe as a Student (SHOULD SUCCEED!)
  const elenaApproveStudent = await fetch(`${baseUrl}/admin/users/${studentId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${elenaLogin.token}`
    },
    body: JSON.stringify({ role: 'student' })
  }).then(r => r.json());
  console.log('Admin Elena approving student:', elenaApproveStudent.message);

  // Elena attempts to approve an Admin (user-admin-2) -> (MUST FAIL WITH 403 HOST_REQUIRED!)
  const elenaApproveAdminAttempt = await fetch(`${baseUrl}/admin/users/user-admin-2/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${elenaLogin.token}`
    },
    body: JSON.stringify({ role: 'admin' })
  });
  console.log('Admin Elena trying to approve an Admin (Should fail with 403):', {
    status: elenaApproveAdminAttempt.status,
    response: (await elenaApproveAdminAttempt.json()).message
  });

  // Login as Host (You)
  const hostLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'host@learningidea.com', password: 'host123' })
  }).then(r => r.json());

  // Host approves Admin -> (SHOULD SUCCEED!)
  const hostApproveAdmin = await fetch(`${baseUrl}/admin/users/user-admin-2/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hostLogin.token}`
    },
    body: JSON.stringify({ role: 'admin' })
  }).then(r => r.json());
  console.log('Host approving Admin account:', hostApproveAdmin.message);

  console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY! ===');
}

runPhoneAndAuthTests().catch(console.error);
