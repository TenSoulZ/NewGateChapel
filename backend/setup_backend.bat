python -m venv venv
call venv\Scripts\activate
pip install django djangorestframework django-cors-headers
django-admin startproject config .
python manage.py startapp api
echo SETUP_COMPLETE > setup_log.txt
