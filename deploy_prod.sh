
#!/bin/bash

# Load env vars from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 1. Sync Database Schema (Migrations)
echo "Running Prisma Migrations..."
npx prisma migrate deploy

# 2. Build the Next.js Application
echo "Building Next.js Production Bundle..."
npm run build

# 3. Deploy to Google Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy hrm-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300s \
  --set-env-vars DATABASE_URL=$DATABASE_URL,DIRECT_URL=$DIRECT_URL,AUTH_SECRET=$AUTH_SECRET,GOOGLE_API_KEY=$GOOGLE_API_KEY

# Note: We use existing ENV vars from the shell or cloudbuild context.
