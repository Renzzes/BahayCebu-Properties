# Deploying to Vercel with Database Configuration

To fix the signup issue in production, follow these steps to properly configure the database connection in Vercel:

## 1. Update Environment Variables in Vercel

Log in to your Vercel dashboard and update the following environment variables for your project:

```
DB_HOST=153.92.15.81
DB_USER=u547531148_bahaycebu_admi
DB_PASSWORD=Bahaycebu123
DB_NAME=u547531148_bahaycebu_db
JWT_SECRET=bahaycebu-jwt-secret-2024
NODE_ENV=production
```

## 2. Deploy the Updated Code

Push the changes we made to your GitHub repository, which will trigger a new deployment on Vercel:

```bash
# Commit the changes
git add .
git commit -m "Fix: Update database connection handling for Vercel deployment"

# Push to GitHub
git push origin main
```

## 3. Verify the Deployment

After the deployment is complete, test the signup functionality on the production site:

1. Go to https://bahaycebu-properties.com
2. Click on the signup button
3. Fill in the registration form with a test email and password
4. Submit the form and verify that the account is created successfully

## 4. Troubleshooting

If you still encounter issues after deployment:

1. Check the Vercel deployment logs for any errors
2. Verify that the environment variables are correctly set in Vercel
3. Test the database connection directly using the verify-db-connection.js script
4. If needed, contact Vercel support for assistance with environment variable configuration

## Changes Made to Fix the Issue

1. Updated `api/_db.ts` to properly handle database connection using individual DB_ environment variables
2. Added detailed error logging in `api/auth/signup.ts`
3. Improved error handling in the frontend Navbar component
4. Created verification scripts to test database connection
5. Added SystemConfig creation if it doesn't exist

These changes ensure that the application can connect to the database correctly in both development and production environments.