// Simple test script to verify API endpoints
const baseUrl = 'http://localhost:3001'\;

async function testAPI() {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    // Test login
    console.log('\nTesting login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alice@smartreport.com',
        password: 'user123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginData.success) {
      const token = loginData.data.token;
      
      // Test actions endpoint
      console.log('\nTesting actions endpoint...');
      const actionsResponse = await fetch(`${baseUrl}/api/actions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const actionsData = await actionsResponse.json();
      console.log('Actions response:', actionsData);

      // Test categories endpoint
      console.log('\nTesting categories endpoint...');
      const categoriesResponse = await fetch(`${baseUrl}/api/categories`);
      const categoriesData = await categoriesResponse.json();
      console.log('Categories response:', categoriesData);
    }

  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAPI();
