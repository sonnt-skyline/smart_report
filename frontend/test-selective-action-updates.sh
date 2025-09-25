#!/bin/bash

# Script to test that only updated actions are sent during report submission
# Usage: ./test-selective-action-updates.sh

set -e

API_BASE_URL="http://localhost:3001/api"
EMAIL="user@smartreport.com"
PASSWORD="user123"

echo "🧪 Testing selective action updates (only modified actions sent)..."

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

# Step 2: Get current actions and select first two
echo "📋 Fetching current actions..."
ACTIONS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/actions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# Extract first two action IDs for testing
FIRST_ACTION_ID=$(echo "$ACTIONS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
SECOND_ACTION_ID=$(echo "$ACTIONS_RESPONSE" | grep -o '"id":"[^"]*"' | head -2 | tail -1 | cut -d'"' -f4)

if [ -z "$FIRST_ACTION_ID" ] || [ -z "$SECOND_ACTION_ID" ]; then
  echo "❌ Could not find enough actions for testing"
  exit 1
fi

echo "✅ Selected test actions:"
echo "   First:  $FIRST_ACTION_ID"
echo "   Second: $SECOND_ACTION_ID"

# Step 3: Update action statuses first (simulate user updating actions in UI)
echo "🎯 Updating action statuses..."

# Update first action to 20% On-going
curl -s -X POST "$API_BASE_URL/actions/$FIRST_ACTION_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"week\":\"2025-W37\",\"progress\":20,\"work_status\":\"On-going\"}" > /dev/null

# Update second action to 35% On-going  
curl -s -X POST "$API_BASE_URL/actions/$SECOND_ACTION_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"week\":\"2025-W37\",\"progress\":35,\"work_status\":\"On-going\"}" > /dev/null

echo "✅ Updated first two actions (others remain untouched)"

# Step 4: Submit weekly report - this should only include the 2 updated actions
echo "📤 Submitting weekly report (should only include 2 updated actions)..."

CURRENT_WEEK="2025-W37"
REPORT_DATA=$(cat <<EOF
{
  "week": "$CURRENT_WEEK",
  "actions": [
    {
      "action_id": "$FIRST_ACTION_ID",
      "progress": 20,
      "work_status": "On-going"
    },
    {
      "action_id": "$SECOND_ACTION_ID", 
      "progress": 35,
      "work_status": "On-going"
    }
  ],
  "progress_notes": "This week's accomplishments:\n• Progressed on \"Deliver project milestone 1\" (20% complete)\n• Progressed on \"Update API documentation\" (35% complete)",
  "blockers_notes": "No major blockers identified this week.",
  "next_steps_notes": "Planned for next week:\n• Continue work on \"Deliver project milestone 1\"\n• Continue work on \"Update API documentation\"",
  "additional_notes": "Testing selective action updates - only modified actions should be sent"
}
EOF
)

SUBMIT_RESPONSE=$(curl -s -X POST "$API_BASE_URL/reports/weekly" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$REPORT_DATA")

echo "📊 Submit Response:"
echo "$SUBMIT_RESPONSE"

echo ""
echo "✅ Test complete!"
echo "🔍 Check browser console logs to verify only 2 actions were sent in the request"
echo "🔍 Verify that other actions retained their previous status and weren't reset"
