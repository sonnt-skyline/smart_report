#!/bin/bash

# Script to debug action status updates step by step
# Usage: ./debug-action-status.sh

set -e

API_BASE_URL="http://localhost:3001/api"
EMAIL="user@smartreport.com"
PASSWORD="user123"

echo "🔍 Debugging action status updates step by step..."

# Step 1: Login and get token
echo "🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token"
  exit 1
fi

echo "✅ Successfully authenticated"

# Step 2: Get actions BEFORE any updates
echo ""
echo "📋 STEP 1: Getting actions BEFORE updates..."
ACTIONS_BEFORE=$(curl -s -X GET "$API_BASE_URL/actions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

FIRST_ACTION_ID=$(echo "$ACTIONS_BEFORE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Target action ID: $FIRST_ACTION_ID"

# Check current status of first action
echo "Current status of first action (week 2025-W37):"
echo "$ACTIONS_BEFORE" | jq --arg id "$FIRST_ACTION_ID" '.data[] | select(.id == $id) | .status_updates[] | select(.week == "2025-W37")' 2>/dev/null || echo "No status update for current week"

# Step 3: Update action status directly
echo ""
echo "🎯 STEP 2: Updating action status to 75% On-going..."
UPDATE_RESPONSE=$(curl -s -X POST "$API_BASE_URL/actions/$FIRST_ACTION_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"week\":\"2025-W37\",\"progress\":75,\"work_status\":\"On-going\"}")

echo "Update response: $UPDATE_RESPONSE"

# Step 4: Get actions AFTER status update
echo ""
echo "📋 STEP 3: Getting actions AFTER status update..."
sleep 1
ACTIONS_AFTER_UPDATE=$(curl -s -X GET "$API_BASE_URL/actions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Status after direct update:"
echo "$ACTIONS_AFTER_UPDATE" | jq --arg id "$FIRST_ACTION_ID" '.data[] | select(.id == $id) | .status_updates[] | select(.week == "2025-W37")' 2>/dev/null || echo "No status update found"

# Step 5: Submit weekly report with this action
echo ""
echo "📤 STEP 4: Submitting weekly report..."
REPORT_DATA=$(cat <<EOF
{
  "week": "2025-W37",
  "actions": [
    {
      "action_id": "$FIRST_ACTION_ID",
      "progress": 75,
      "work_status": "On-going"
    }
  ],
  "progress_notes": "Debug test - checking action status persistence",
  "blockers_notes": "No blockers",
  "next_steps_notes": "Verify status is maintained",
  "additional_notes": "Testing action status updates"
}
EOF
)

SUBMIT_RESPONSE=$(curl -s -X POST "$API_BASE_URL/reports/weekly" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$REPORT_DATA")

echo "Submit response: $SUBMIT_RESPONSE"

# Step 6: Get actions AFTER report submission
echo ""
echo "📋 STEP 5: Getting actions AFTER report submission..."
sleep 2
ACTIONS_AFTER_REPORT=$(curl -s -X GET "$API_BASE_URL/actions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Final status after report submission:"
echo "$ACTIONS_AFTER_REPORT" | jq --arg id "$FIRST_ACTION_ID" '.data[] | select(.id == $id) | .status_updates[] | select(.week == "2025-W37")' 2>/dev/null || echo "No status update found"

echo ""
echo "🔍 Analysis complete! Compare the status values at each step."
