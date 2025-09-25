import http from 'http';

async function testAPI() {
  try {
    // Test login
    const loginData = JSON.stringify({
      email: 'user@smartreport.com',
      password: 'user123'
    });

    const loginOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    console.log('Testing login...');
    
    const loginReq = http.request(loginOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('Login response:', response);
          
          if (response.success && response.data.token) {
            console.log('✅ Login successful');
            testActions(response.data.token);
          } else {
            console.log('❌ Login failed');
          }
        } catch (err) {
          console.log('❌ Login response parse error:', err.message);
        }
      });
    });

    loginReq.on('error', (err) => {
      console.log('❌ Login request error:', err.message);
    });

    loginReq.write(loginData);
    loginReq.end();

  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

function testActions(token) {
  const actionsOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/actions',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  console.log('Testing actions endpoint...');
  
  const actionsReq = http.request(actionsOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Actions response:', {
          success: response.success,
          count: response.data?.actions?.length || 0,
          total: response.data?.total || 0
        });
        
        if (response.success && response.data.actions) {
          console.log('✅ Actions loaded successfully');
          console.log(`📊 Found ${response.data.actions.length} actions`);
          
          // Show first few actions
          response.data.actions.slice(0, 3).forEach((action, idx) => {
            console.log(`${idx + 1}. ${action.title} (${action.category})`);
          });
        } else {
          console.log('❌ Actions loading failed');
        }
      } catch (err) {
        console.log('❌ Actions response parse error:', err.message);
      }
    });
  });

  actionsReq.on('error', (err) => {
    console.log('❌ Actions request error:', err.message);
  });

  actionsReq.end();
}

// Run the test
testAPI();
