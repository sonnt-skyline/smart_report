#!/bin/bash

# Script to verify the injected test data via API
# Usage: ./verify-test-data.sh

set -e

API_BASE_URL="http://localhost:3001/api"
EMAIL="user@smartreport.com"
PASSWORD="user123"

echo "🔍 Verifying injected test data via API..."

# Step 1: Login and get token
echo "🔐 Logging in as $EMAIL..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

# Extract token from response
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token. Response:"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Successfully authenticated"

# Step 2: Fetch weekly reports
echo "📋 Fetching weekly reports..."
REPORTS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/reports/weekly" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "📊 Weekly Reports Response:"
echo "$REPORTS_RESPONSE" | jq '.' 2>/dev/null || echo "$REPORTS_RESPONSE"

# Step 3: Fetch user actions with status
echo ""
echo "🎯 Fetching user actions..."
ACTIONS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/actions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "📋 Actions Response (first 500 chars):"
echo "$ACTIONS_RESPONSE" | head -c 500

echo ""
echo "✅ Data verification complete!"
