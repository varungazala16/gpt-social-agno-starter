# Backend

Backend application for GPT Social.

## Development Setup

### 1. Install Dependencies

```bash
poetry install
```

This will create a virtual environment and install all dependencies from `poetry.lock`.

### 2. Set Up Pre-commit Hooks (Optional but Recommended)

```bash
poetry run pre-commit install
```

### 3. Configure Your Environment

Make sure your `.env` file has the necessary configuration (database credentials, API keys, etc.)

### 4. Run Database Migrations

```bash
poetry run alembic upgrade head
```

### 5. Start the FastAPI Server

```bash
poetry run uvicorn app.main:app --reload
```

Or if you want to specify host/port:

```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` and interactive documentation at `http://localhost:8000/docs`.

## Code Quality Tools

### Running Tools Independently

Run the linter (Ruff):
```bash
poetry run ruff check .
poetry run ruff format .
```

Run the type checker (mypy):
```bash
poetry run mypy .
```

Run the test suite:
```bash
poetry run pytest
```

Run all pre-commit hooks manually without committing:
```bash
pre-commit run --all-files
```

## Docker

### Building Locally

```bash
docker build -t gpt-social-backend:local .
```

### Running Locally

```bash
docker run -p 8080:8080 --env-file .env gpt-social-backend:local
```

The API will be available at `http://localhost:8080`.

## Deployment to GCP Cloud Run

This project uses GitHub Actions to automatically deploy to Google Cloud Run when changes are pushed to the `main` branch.

### Prerequisites

1. **GCP Project**: Create or use an existing GCP project
2. **Enable APIs**:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Create a Service Account**:
   ```bash
   gcloud iam service-accounts create github-actions \
       --display-name="GitHub Actions"
   ```

4. **Grant necessary permissions**:
   ```bash
   export PROJECT_ID=your-project-id
   export SA_EMAIL=github-actions@${PROJECT_ID}.iam.gserviceaccount.com

   gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:${SA_EMAIL}" \
       --role="roles/run.admin"

   gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:${SA_EMAIL}" \
       --role="roles/storage.admin"

   gcloud projects add-iam-policy-binding $PROJECT_ID \
       --member="serviceAccount:${SA_EMAIL}" \
       --role="roles/iam.serviceAccountUser"
   ```

5. **Create and download service account key**:
   ```bash
   gcloud iam service-accounts keys create key.json \
       --iam-account=${SA_EMAIL}
   ```

6. **Store secrets in GCP Secret Manager**:
   ```bash
   # Create secrets for all environment variables
   echo -n "your-supabase-url" | gcloud secrets create SUPABASE_URL --data-file=-
   echo -n "your-supabase-key" | gcloud secrets create SUPABASE_KEY --data-file=-
   echo -n "your-postgres-server" | gcloud secrets create POSTGRES_SERVER --data-file=-
   echo -n "your-postgres-user" | gcloud secrets create POSTGRES_USER --data-file=-
   echo -n "your-postgres-password" | gcloud secrets create POSTGRES_PASSWORD --data-file=-
   echo -n "postgres" | gcloud secrets create POSTGRES_DB --data-file=-
   echo -n "your-encryption-key" | gcloud secrets create SQLALCHEMY_ENCRYPTION_KEY --data-file=-
   echo -n "your-secret-key" | gcloud secrets create SECRET_KEY --data-file=-

   # OAuth credentials
   echo -n "your-tiktok-client-key" | gcloud secrets create TIKTOK_CLIENT_KEY --data-file=-
   echo -n "your-tiktok-client-secret" | gcloud secrets create TIKTOK_CLIENT_SECRET --data-file=-
   echo -n "your-tiktok-redirect-uri" | gcloud secrets create TIKTOK_REDIRECT_URI --data-file=-
   echo -n "your-instagram-client-id" | gcloud secrets create INSTAGRAM_CLIENT_ID --data-file=-
   echo -n "your-instagram-client-secret" | gcloud secrets create INSTAGRAM_CLIENT_SECRET --data-file=-
   echo -n "your-instagram-redirect-uri" | gcloud secrets create INSTAGRAM_REDIRECT_URI --data-file=-
   echo -n "your-youtube-client-id" | gcloud secrets create YOUTUBE_CLIENT_ID --data-file=-
   echo -n "your-youtube-client-secret" | gcloud secrets create YOUTUBE_CLIENT_SECRET --data-file=-
   echo -n "your-youtube-redirect-uri" | gcloud secrets create YOUTUBE_REDIRECT_URI --data-file=-
   ```

7. **Grant service account access to secrets**:
   ```bash
   for secret in SUPABASE_URL SUPABASE_KEY POSTGRES_SERVER POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB SQLALCHEMY_ENCRYPTION_KEY SECRET_KEY TIKTOK_CLIENT_KEY TIKTOK_CLIENT_SECRET TIKTOK_REDIRECT_URI INSTAGRAM_CLIENT_ID INSTAGRAM_CLIENT_SECRET INSTAGRAM_REDIRECT_URI YOUTUBE_CLIENT_ID YOUTUBE_CLIENT_SECRET YOUTUBE_REDIRECT_URI; do
     gcloud secrets add-iam-policy-binding $secret \
       --member="serviceAccount:${SA_EMAIL}" \
       --role="roles/secretmanager.secretAccessor"
   done
   ```

### GitHub Secrets Setup

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

1. **GCP_PROJECT_ID**: Your GCP project ID
2. **GCP_SA_KEY**: Contents of the `key.json` file created above

### Manual Deployment

To manually trigger a deployment, go to the Actions tab in GitHub and run the "Deploy to Cloud Run" workflow.

### Environment Variables

Production environment variables are managed through GCP Secret Manager. To update a secret:

```bash
echo -n "new-value" | gcloud secrets versions add SECRET_NAME --data-file=-
```
