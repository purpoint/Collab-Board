async function test() {
  const BASE_URL = 'http://127.0.0.1:8080';
  try {
    console.log('Testing /health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    console.log('Health Status:', healthRes.status, await healthRes.json());

    const username = `testuser_${Date.now()}`;
    console.log(`\nTesting /api/auth/register with username: ${username}...`);
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        email: `${username}@example.com`,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    console.log('Register Status:', regRes.status, regData);

    if (regRes.status === 201) {
      const token = regData.token;
      console.log('\nTesting /api/boards (Create Board)...');
      const boardRes = await fetch(`${BASE_URL}/api/boards`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: 'Test Board' })
      });
      console.log('Create Board Status:', boardRes.status, await boardRes.json());
    }
  } catch (err) {
    console.error('Test failed:', err.stack || err.message);
  }
}

test();
