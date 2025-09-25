#!/bin/bash

# Script to test action status updates during report submission
# Usage: ./test-action-updates.sh

set -e

API_BASE_URL="http://localhost:3001/api"
EMAIL="user@smartreport.com"
PASSWORD="user123"

echo "🧪 Testing action status updates during report submission..."

# Step 1: Login and get token
echo "🔐 Logging in as $EMAIL..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token"
  exit 1
fi

echo "✅ Successfully authenticated"

# Step 2: Get current actions
echo "📋 Fetching current actions..."
ACTIONS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/actions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# Extract first action ID for testing
FIRST_ACTION_ID=$(echo "$ACTIONS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$FIRST_ACTION_ID" ]; then
  echo "❌ No actions found"
  exit 1
fi

echo "✅ Found test action: $FIRST_ACTION_ID"

# Step 3: Submit a test weekly report with action status updates
echo "📤 Submitting test weekly report for week 2025-W37..."

CURRENT_WEEK="2025-W37"
REPORT_DATA=$(cat <<EOF
{
  "week": "$CURRENT_WEEK",
  "actions": [
    {
      "action_id": "$FIRST_ACTION_ID",
      "progress": 75,
      "work_status": "On-going"
    }
  ],
  "progress_notes": "Test submission to verify action status updates are preserved",
  "blockers_notes": "No blockers - testing functionality",
  "next_steps_notes": "Verify that action progress is correctly saved",
  "additional_notes": "This is a test report to check action status persistence"
}
EOF
)

SUBMIT_RESPONSE=$(curl -s -X POST "$API_BASE_URL/reports/weekly" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$REPORT_DATA")

echo "📊 Submit Response:"
echo "$SUBMIT_RESPONSE"

# Step 4: Verify the action status was updated
echo ""
echo "🔍 Verifying action status after report submission..."

# Get updated actions
UPDATED_ACTIONS=$(curl -s -X GET "$API_BASE_URL/actions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "📋 Updated actions (first 300 chars):"
echo "$UPDATED_ACTIONS" | head -c 300

echo ""
echo "✅ Test complete! Check the action status updates above."
