// Test logout functionality
const baseUrl = 'http://localhost:3002';

async function testLogout() {
  try {
    console.log('🧪 Testing logout functionality...\n');
    
    // Step 1: Login first
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed, trying to register first...');
      
      // Try to register first
      const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      if (!registerResponse.ok) {
        console.log('❌ Registration failed');
        return;
      }
      
      console.log('✅ Registration successful, now logging in...');
    }
    
    const loginData = await loginResponse.ok ? await loginResponse.json() : await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }).then(res => res.json());
    
    console.log('✅ Login successful');
    console.log('   User:', loginData.user.name);
    console.log('   Token:', loginData.token.substring(0, 20) + '...');
    
    // Step 2: Test logout
    console.log('\n2️⃣ Testing logout...');
    const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
      }
    });
    
    const logoutData = await logoutResponse.json();
    
    if (logoutResponse.ok) {
      console.log('✅ Logout successful');
      console.log('   Message:', logoutData.message);
    } else {
      console.log('❌ Logout failed:', logoutData.error);
    }
    
    // Step 3: Test token verification after logout
    console.log('\n3️⃣ Testing token verification after logout...');
    const verifyResponse = await fetch(`${baseUrl}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
      }
    });
    
    if (verifyResponse.ok) {
      console.log('❌ Token should be invalid after logout');
    } else {
      console.log('✅ Token correctly invalidated after logout');
    }
    
    console.log('\n🎉 Logout tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogout();
