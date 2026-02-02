#!/usr/bin/env bash
# Exit on error
set -o errexit

# Apply database migrations
python manage.py migrate

# Create superuser (fail silently if exists)
if [[ -n "$DJANGO_SUPERUSER_USERNAME" ]]; then
    python manage.py createsuperuser --noinput || echo "Superuser already exists or creation failed."
fi

# Seed initial data (idempotent operations)
python manage.py seed_initial_data
python manage.py populate_data

# Start Gunicorn
gunicorn config.wsgi:application
