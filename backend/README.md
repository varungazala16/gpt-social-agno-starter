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
