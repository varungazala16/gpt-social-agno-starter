# Backend

Backend application for GPT Social.

## Development Setup

### Install Dependencies

```bash
pipenv install --dev
```

### Code Quality Tools

#### Pre-commit Hooks

Install pre-commit hooks to automatically run linting and type checking before each commit:

```bash
pre-commit install
```

#### Running Tools Independently

Run the linter (Ruff):
```bash
pipenv run ruff check .
pipenv run ruff format .
```

Run the type checker (mypy):
```bash
pipenv run mypy .
```

Run all pre-commit hooks manually without committing:
```bash
pre-commit run --all-files
```
