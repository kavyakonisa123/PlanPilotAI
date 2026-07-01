# Day 7 Deployment Checklist

This checklist captures the first production deployment flow for PlanPilotAI.

## Frontend on Vercel

1. Import the GitHub repository in Vercel.
2. Set the project root directory to `frontend`.
3. Keep the build command as `npm run build`.
4. Add this environment variable:

```text
NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
```

5. Deploy and copy the public frontend URL.

## Backend on Railway

1. Create a new Railway service from this GitHub repository.
2. Use the repository root as the root directory.
3. Use this build command:

```bash
python -m pip install --upgrade pip && python -m pip install -r requirements.txt
```

4. Use this start command:

```bash
alembic upgrade head && python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

5. Add these environment variables:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
BACKEND_CORS_ORIGINS=https://your-vercel-app.vercel.app
```

`DATABASE_URL` must be the Supabase Postgres connection string. If this variable is missing, Railway will fall back to the local development database URL and the deploy logs will show a failed connection to `127.0.0.1:5432`.

6. Redeploy the Railway service after saving environment variables.

7. Confirm the health check works:

```bash
curl https://your-railway-backend.up.railway.app/health
```

## GitHub Actions

The workflow in `.github/workflows/ci.yml` runs on pull requests and pushes to `main`.

It checks:

- Frontend dependency install
- Frontend lint
- Frontend production build
- Backend dependency install
- Backend Python compile

Optional Vercel deploy automation can be enabled by adding these GitHub repository secrets:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Railway can deploy directly from the connected GitHub repository after each push.

## Production Connection

After both services are deployed:

1. Put the Railway backend URL into Vercel as `NEXT_PUBLIC_API_URL`.
2. Put the Vercel frontend URL into Railway as `BACKEND_CORS_ORIGINS`.
3. Redeploy both services.
4. Open the frontend and submit a trip request.
5. Confirm the request reaches the deployed backend and returns an itinerary.

## Public Links

Replace these placeholders after deployment:

- Frontend: `https://your-vercel-app.vercel.app`
- Backend health check: `https://your-railway-backend.up.railway.app/health`
