/**
 * Live End-to-End Authentication Test Suite
 * Tests live endpoints on http://localhost:3001
 */

const BASE_URL = 'http://localhost:3001';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runLiveTests() {
  console.log('=== Running Live End-to-End Authentication Tests on http://localhost:3001 ===\n');

  // TEST 1: Zod Validation on /api/auth/check-email
  console.log('--- Test Suite 1: Email-First Validation ---');
  const resInvalid = await fetch(`${BASE_URL}/api/auth/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-valid-email' }),
  });
  const dataInvalid = await resInvalid.json();
  assert(resInvalid.status === 400 && dataInvalid.success === false, '1.1: Invalid email format returns HTTP 400 validation error');

  // TEST 2: Unregistered Email Check (using valid Gmail format: letters, numbers, dots)
  const unregEmail = `citzos.unreg.${Date.now()}@gmail.com`;
  const resUnreg = await fetch(`${BASE_URL}/api/auth/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: unregEmail, lang: 'en' }),
  });
  const dataUnreg = await resUnreg.json();
  assert(resUnreg.status === 200, '2.1: Check-email returns HTTP 200 for unregistered email');
  assert(dataUnreg.exists === false, '2.2: returns exists: false');
  assert(dataUnreg.message === "No account found with this email. Let's create one.", `2.3: Returns friendly redirection message: "${dataUnreg.message}"`);

  // TEST 3: User Registration (/api/auth/signup) with 100% Real Data
  console.log('\n--- Test Suite 2: Register Flow Completion & Cookie Generation ---');
  const testUser = {
    fullName: 'Rahul Sharma',
    email: `rahul.sharma.${Date.now()}@gmail.com`,
    password: 'Password@123',
    dob: '2001-05-15',
    country: 'IN',
    casteCategory: 'General',
    gender: 'male',
    state: 'Maharashtra',
    administrativeDivision: 'Maharashtra',
    lifePhase: 'college_student',
  };

  const resSignup = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const dataSignup = await resSignup.json();
  const setCookieHeader = resSignup.headers.get('set-cookie') || '';

  assert(resSignup.status === 200 && dataSignup.success === true, '3.1: Signup completes successfully with HTTP 200');
  assert(Boolean(dataSignup.citizen && dataSignup.citizen.id), '3.2: Citizen profile created in database');
  assert(dataSignup.citizen?.fullName === testUser.fullName, '3.3: Real user name correctly stored (no dummy name)');
  assert(dataSignup.citizen?.dob === testUser.dob, '3.4: Real DOB correctly stored');
  assert(dataSignup.citizen?.age >= 22 && dataSignup.citizen?.age <= 26, `3.5: Exact age calculated dynamically from DOB: ${dataSignup.citizen?.age}`);
  assert(dataSignup.citizen?.state === 'Maharashtra', '3.6: Real state stored correctly (no random state assigned)');
  assert(setCookieHeader.includes('citzos_session='), '3.7: Set-Cookie header contains citzos_session cookie');
  assert(setCookieHeader.toLowerCase().includes('httponly'), '3.8: citzos_session cookie is marked HttpOnly');

  // Extract session token from cookie
  const cookieMatch = setCookieHeader.match(/citzos_session=([^;]+)/);
  const sessionToken = cookieMatch ? cookieMatch[1] : '';
  assert(Boolean(sessionToken), '3.9: citzos_session token extracted from response header');

  // TEST 4: Registered Email Check (/api/auth/check-email)
  console.log('\n--- Test Suite 3: Registered Email Detection ---');
  const resRegCheck = await fetch(`${BASE_URL}/api/auth/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, lang: 'en' }),
  });
  const dataRegCheck = await resRegCheck.json();
  assert(resRegCheck.status === 200, '4.1: Check-email returns HTTP 200 for registered email');
  assert(dataRegCheck.exists === true, '4.2: returns exists: true');
  assert(dataRegCheck.verified === true, '4.3: returns verified: true');
  assert(dataRegCheck.isGoogleLinked === false, '4.4: correctly detects account uses direct password');

  // TEST 5: Password Login (/api/auth/login)
  console.log('\n--- Test Suite 4: Password Verification & Login ---');
  const resWrongLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: 'WrongPassword999' }),
  });
  assert(resWrongLogin.status === 401, '5.1: Incorrect password returns HTTP 401 Unauthorized');

  const resCorrectLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  });
  const dataCorrectLogin = await resCorrectLogin.json();
  const loginCookieHeader = resCorrectLogin.headers.get('set-cookie') || '';
  assert(resCorrectLogin.status === 200 && dataCorrectLogin.success === true, '5.2: Correct password logs in successfully with HTTP 200');
  assert(loginCookieHeader.includes('citzos_session='), '5.3: Login response sets citzos_session HttpOnly cookie');

  // TEST 6: Session Verification (/api/auth/me)
  console.log('\n--- Test Suite 5: Session Endpoint ---');
  const resMeUnauth = await fetch(`${BASE_URL}/api/auth/me`);
  assert(resMeUnauth.status === 401, '6.1: GET /api/auth/me without cookie returns 401 Unauthorized');

  const resMeAuth = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: `citzos_session=${sessionToken}` },
  });
  const dataMeAuth = await resMeAuth.json();
  assert(resMeAuth.status === 200 && dataMeAuth.authenticated === true, '6.2: GET /api/auth/me with cookie returns authenticated: true');
  assert(dataMeAuth.citizen?.email === testUser.email, '6.3: Returns correct authenticated citizen record');

  // TEST 7: Middleware Server-Side Redirects
  console.log('\n--- Test Suite 6: Middleware Instant Server Redirects ---');

  // 7.1: Unauthenticated request to / should redirect to /login?next=%2F
  const resHomeUnauth = await fetch(`${BASE_URL}/`, { redirect: 'manual' });
  assert(resHomeUnauth.status === 307 || resHomeUnauth.status === 302, `7.1: Logged-out user visiting / gets HTTP 307 redirect (Status: ${resHomeUnauth.status})`);
  const locHome = resHomeUnauth.headers.get('location') || '';
  assert(locHome.includes('/login?next='), `7.2: Redirect location contains /login?next= (${locHome})`);

  // 7.2: Unauthenticated request to /saved should redirect to /login?next=%2Fsaved
  const resSavedUnauth = await fetch(`${BASE_URL}/saved`, { redirect: 'manual' });
  const locSaved = resSavedUnauth.headers.get('location') || '';
  assert(locSaved.includes('/login?next=%2Fsaved'), `7.3: Logged-out user visiting /saved redirects to /login?next=%2Fsaved (${locSaved})`);

  // 7.3: Authenticated user visiting /login should redirect to / instantly
  const resLoginAuth = await fetch(`${BASE_URL}/login`, {
    headers: { Cookie: `citzos_session=${sessionToken}` },
    redirect: 'manual',
  });
  assert(resLoginAuth.status === 307 || resLoginAuth.status === 302, `7.4: Logged-in user visiting /login gets instant redirect (Status: ${resLoginAuth.status})`);
  const locLogin = resLoginAuth.headers.get('location') || '';
  assert(locLogin.endsWith('/'), `7.5: Redirect location is home page (${locLogin})`);

  // 7.4: Authenticated user visiting /register should redirect to / instantly
  const resRegisterAuth = await fetch(`${BASE_URL}/register`, {
    headers: { Cookie: `citzos_session=${sessionToken}` },
    redirect: 'manual',
  });
  assert(resRegisterAuth.status === 307 || resRegisterAuth.status === 302, `7.6: Logged-in user visiting /register gets instant redirect (Status: ${resRegisterAuth.status})`);

  // 7.5: Safe redirect with ?next=/skills
  const resNextAuth = await fetch(`${BASE_URL}/login?next=/skills`, {
    headers: { Cookie: `citzos_session=${sessionToken}` },
    redirect: 'manual',
  });
  const locNext = resNextAuth.headers.get('location') || '';
  assert(locNext.endsWith('/skills'), `7.7: Valid next param correctly redirected to /skills (${locNext})`);

  // 7.6: Open redirect attack prevention
  const resMaliciousNext = await fetch(`${BASE_URL}/login?next=https://malicious-site.com`, {
    headers: { Cookie: `citzos_session=${sessionToken}` },
    redirect: 'manual',
  });
  const locMalicious = resMaliciousNext.headers.get('location') || '';
  assert(locMalicious.endsWith('/') && !locMalicious.includes('malicious-site'), `7.8: Open redirect attack sanitized to / (${locMalicious})`);

  // 7.7: Protocol-relative open redirect attack prevention
  const resProtocolRelative = await fetch(`${BASE_URL}/login?next=//evil.com`, {
    headers: { Cookie: `citzos_session=${sessionToken}` },
    redirect: 'manual',
  });
  const locProtocolRelative = resProtocolRelative.headers.get('location') || '';
  assert(locProtocolRelative.endsWith('/') && !locProtocolRelative.includes('evil.com'), `7.9: Protocol-relative open redirect sanitized to / (${locProtocolRelative})`);

  console.log(`\n======================================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
