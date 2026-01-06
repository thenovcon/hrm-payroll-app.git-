#!/bin/bash
# Simply deploy to Cloud Run using the existing build
# Assumes build is verified.

PROJECT_ID="hrm-payroll-483000"
SERVICE_NAME="hrm-app"
REGION="us-central1"

# Load env vars from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Deploying to Cloud Run with Environment Variables..."

# Run database migrations
# Note: Using npx here implies we are migrating the PROD DB from local machine
# because we sourced the .env above. This is correct for managed DBs.
# If using SQLite in Cloud Run (bad practice), this will migrate LOCAL db.
echo "Running Prisma Migrations..."
npx prisma migrate deploy

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_API_KEY=${GOOGLE_API_KEY},DATABASE_URL=${DATABASE_URL},DIRECT_URL=${DIRECT_URL},AUTH_SECRET=${AUTH_SECRET},AUTH_TRUST_HOST=true"
