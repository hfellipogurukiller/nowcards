// Using native fetch in Node.js 18+

async function testAuth() {
  const baseUrl = 'http://localhost:3002';
  
  try {
    console.log('🧪 Testing authentication flow...\n');
    
    // Test 1: Register a new user
    console.log('1️⃣ Testing user registration...');
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
    
    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful');
      console.log('   User:', registerData.user.name);
      console.log('   Token:', registerData.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Registration failed:', registerData.error);
    }
    
    // Test 2: Login with the same user
    console.log('\n2️⃣ Testing user login...');
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
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful');
      console.log('   User:', loginData.user.name);
      console.log('   Token:', loginData.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
    
    // Test 3: Test logout
    if (loginResponse.ok) {
      console.log('\n3️⃣ Testing user logout...');
      const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
        }
      });
      
      const logoutData = await logoutResponse.json();
      
      if (logoutResponse.ok) {
        console.log('✅ Logout successful');
      } else {
        console.log('❌ Logout failed:', logoutData.error);
      }
    }
    
    console.log('\n🎉 Authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth();
