#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate

# Create superuser (fail silently if exists)
# Seed initial data (idempotent operations)
python manage.py seed_initial_data
python manage.py populate_data

if [[ -n "$DJANGO_SUPERUSER_USERNAME" ]]; then
    python manage.py createsuperuser --noinput || echo "Superuser already exists or creation failed."
fi
