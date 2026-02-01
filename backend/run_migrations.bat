@echo off
py manage.py makemigrations api
py manage.py migrate api
py manage.py seed_initial_data
pause
