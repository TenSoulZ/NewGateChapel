venv\Scripts\python manage.py makemigrations api > migration_log.txt 2>&1
venv\Scripts\python manage.py migrate >> migration_log.txt 2>&1
venv\Scripts\python manage.py check >> migration_log.txt 2>&1
