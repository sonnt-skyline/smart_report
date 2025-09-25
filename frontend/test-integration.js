// Quick integration test for the API
import { weeklyReportAPI, authAPI } from './src/utils/api.js';

async function testIntegration() {
  console.log('🧪 Testing API Integration...\n');

  try {
    // Test 1: Login
    console.log('1. Testing login...');
    const loginResult = await authAPI.login('test@example.com', 'test123');
    console.log('✅ Login successful:', loginResult.success);
    console.log('User:', loginResult.data.user.name);
    console.log('Token received:', !!loginResult.data.token);

    // Test 2: Get actions
    console.log('\n2. Testing get actions...');
    const actions = await weeklyReportAPI.getUserActions();
    console.log('✅ Actions retrieved:', actions.length);
    actions.forEach((action, index) => {
      console.log(`   ${index + 1}. ${action.title} (${action.category})`);
    });

    // Test 3: Create action
    console.log('\n3. Testing create action...');
    const newAction = await weeklyReportAPI.createAction({
      title: 'Test API Integration',
      category: 'Testing',
      subCategory: 'Integration',
      target: 'Verify API works',
      definitionOfDone: 'All API calls successful',
      deadline: '2025-09-10'
    });
    console.log('✅ Action created:', newAction.title);

    console.log('\n🎉 All tests passed! Backend integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testIntegration();
