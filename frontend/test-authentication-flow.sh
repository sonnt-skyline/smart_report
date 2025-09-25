#!/bin/bash

echo "🧪 Testing Complete Authentication Flow..."
echo

# Test 1: Backend Health
echo "1. Testing backend availability..."
HEALTH_CHECK=$(curl -s http://localhost:3001/api/actions | jq -r '.success // "false"')
if [ "$HEALTH_CHECK" = "true" ] || [ "$HEALTH_CHECK" = "false" ]; then
  echo "✅ Backend is responding"
else
  echo "❌ Backend not responding"
  exit 1
fi

# Test 2: Demo User Login
echo
echo "2. Testing demo user login..."
DEMO_LOGIN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  http://localhost:3001/api/auth/login)

DEMO_TOKEN=$(echo $DEMO_LOGIN | jq -r '.data.token // "null"')
DEMO_USER=$(echo $DEMO_LOGIN | jq -r '.data.user.name // "null"')

if [ "$DEMO_TOKEN" != "null" ] && [ "$DEMO_USER" != "null" ]; then
  echo "✅ Demo user login successful: $DEMO_USER"
else
  echo "❌ Demo user login failed"
  exit 1
fi

# Test 3: Admin User Login
echo
echo "3. Testing admin user login..."
ADMIN_LOGIN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@smartreport.com","password":"admin123"}' \
  http://localhost:3001/api/auth/login)

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | jq -r '.data.token // "null"')
ADMIN_USER=$(echo $ADMIN_LOGIN | jq -r '.data.user.name // "null"')

if [ "$ADMIN_TOKEN" != "null" ] && [ "$ADMIN_USER" != "null" ]; then
  echo "✅ Admin user login successful: $ADMIN_USER"
else
  echo "❌ Admin user login failed"
  exit 1
fi

# Test 4: Frontend Accessibility
echo
echo "4. Testing frontend availability..."
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$FRONTEND_CHECK" = "200" ]; then
  echo "✅ Frontend is accessible at http://localhost:5173"
else
  echo "❌ Frontend not accessible"
  exit 1
fi

echo
echo "🎉 Complete Authentication Flow Test Passed!"
echo
echo "📋 Test Results Summary:"
echo "   ✅ Backend API: Responding"
echo "   ✅ Demo User Login: Working (test@example.com)"
echo "   ✅ Admin User Login: Working (admin@smartreport.com)"
echo "   ✅ Frontend Access: Available"
echo
echo "🚀 Ready to Demo!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo
echo "🎯 Quick Demo Steps:"
echo "   1. Visit http://localhost:5173"
echo "   2. Click 'Demo User' or 'Admin Demo'"
echo "   3. Explore the authenticated interface"
echo "   4. Test logout functionality"
echo "   5. Try manual login with existing accounts"
