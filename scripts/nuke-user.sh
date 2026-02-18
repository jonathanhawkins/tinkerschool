#!/bin/bash
# ---------------------------------------------------------------------------
# nuke-user.sh — Delete a test user from Clerk + Supabase for onboarding retesting
# ---------------------------------------------------------------------------
# Usage:
#   ./scripts/nuke-user.sh <email>
#   ./scripts/nuke-user.sh docholidayminer@gmail.com
#
# What it does:
#   1. Finds the Clerk user by email
#   2. Finds their Supabase profile by clerk_id
#   3. Deletes all Supabase data (progress, badges, chats, learning profiles, profiles, family)
#   4. Deletes the Clerk user
#   5. Clears relevant localStorage keys (prints reminder)
#
# Requires: .env.local with CLERK_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.local"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <email>"
  echo "Example: $0 docholidayminer@gmail.com"
  exit 1
fi

EMAIL="$1"

# Load env vars
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: .env.local not found at $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

if [[ -z "${CLERK_SECRET_KEY:-}" ]]; then
  echo "Error: CLERK_SECRET_KEY not set in .env.local"
  exit 1
fi

if [[ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "Error: Supabase env vars not set in .env.local"
  exit 1
fi

SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
SUPABASE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo "🔍 Looking up Clerk user: $EMAIL"

# Step 1: Find the Clerk user by email
CLERK_RESPONSE=$(curl -s "https://api.clerk.com/v1/users?email_address=$EMAIL&limit=1" \
  -H "Authorization: Bearer ${CLERK_SECRET_KEY}")

CLERK_USER_ID=$(echo "$CLERK_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if isinstance(data, list) and len(data) > 0:
    print(data[0]['id'])
else:
    print('')
" 2>/dev/null || echo "")

if [[ -z "$CLERK_USER_ID" ]]; then
  echo "❌ No Clerk user found for $EMAIL"
  echo "   (They may have already been deleted from Clerk)"
  echo ""
  echo "Checking Supabase for any orphaned data..."

  # Try to find by email pattern in display_name or just list all
  echo "   Run manually if needed:"
  echo "   SELECT * FROM profiles WHERE clerk_id ILIKE '%$EMAIL%';"
  exit 1
fi

echo "✅ Found Clerk user: $CLERK_USER_ID"

# Step 2: Find their Supabase profile
echo "🔍 Looking up Supabase profile..."

SUPABASE_RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/profiles?clerk_id=eq.$CLERK_USER_ID&select=id,family_id,display_name,role" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY")

FAMILY_ID=$(echo "$SUPABASE_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if isinstance(data, list) and len(data) > 0:
    print(data[0].get('family_id', ''))
else:
    print('')
" 2>/dev/null || echo "")

PROFILE_INFO=$(echo "$SUPABASE_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if isinstance(data, list) and len(data) > 0:
    p = data[0]
    print(f\"  {p['display_name']} ({p['role']}) - family: {p['family_id']}\")
else:
    print('  (no profile found)')
" 2>/dev/null || echo "  (parse error)")

echo "$PROFILE_INFO"

if [[ -n "$FAMILY_ID" ]]; then
  # Step 3: Find all profiles in the family
  echo "🔍 Finding all family members..."

  FAMILY_PROFILES=$(curl -s "$SUPABASE_URL/rest/v1/profiles?family_id=eq.$FAMILY_ID&select=id,display_name,role" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY")

  echo "$FAMILY_PROFILES" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for p in data:
    print(f\"  - {p['display_name']} ({p['role']}): {p['id']}\")
" 2>/dev/null || echo "  (could not list)"

  PROFILE_IDS=$(echo "$FAMILY_PROFILES" | python3 -c "
import sys, json
data = json.load(sys.stdin)
ids = [p['id'] for p in data]
# Format as Supabase filter: in.(id1,id2,id3)
print('in.(' + ','.join(ids) + ')')
" 2>/dev/null || echo "")

  # Step 4: Delete all dependent Supabase data
  echo "🗑️  Deleting Supabase data..."

  for table in progress user_badges chat_sessions learning_profiles; do
    RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$SUPABASE_URL/rest/v1/$table?profile_id=$PROFILE_IDS" \
      -H "apikey: $SUPABASE_KEY" \
      -H "Authorization: Bearer $SUPABASE_KEY")
    echo "   $table: $RESULT"
  done

  # Delete profiles
  RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
    -X DELETE "$SUPABASE_URL/rest/v1/profiles?family_id=eq.$FAMILY_ID" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY")
  echo "   profiles: $RESULT"

  # Delete family
  RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
    -X DELETE "$SUPABASE_URL/rest/v1/families?id=eq.$FAMILY_ID" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY")
  echo "   families: $RESULT"

  echo "✅ Supabase data deleted"
else
  echo "⚠️  No Supabase profile found (may already be clean)"
fi

# Step 5: Delete the Clerk user
echo "🗑️  Deleting Clerk user..."

DELETE_RESPONSE=$(curl -s -X DELETE "https://api.clerk.com/v1/users/$CLERK_USER_ID" \
  -H "Authorization: Bearer ${CLERK_SECRET_KEY}" \
  -H "Content-Type: application/json")

DELETED=$(echo "$DELETE_RESPONSE" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('yes' if d.get('deleted') else 'no')
" 2>/dev/null || echo "unknown")

if [[ "$DELETED" == "yes" ]]; then
  echo "✅ Clerk user deleted"
else
  echo "❌ Clerk delete failed: $DELETE_RESPONSE"
fi

# Done
echo ""
echo "🎉 User $EMAIL has been nuked!"
echo ""
echo "📝 Remember to clear localStorage in your browser:"
echo "   - tinkerschool_onboarding"
echo "   - tinkerschool_walkthrough_seen"
echo "   - tinkerschool_mc_walkthrough_seen"
echo "   - tinkerschool-tutorial-progress"
echo ""
echo "   Or use the Dev Tools widget (bug icon) → Reset Walkthroughs"
