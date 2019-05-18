import gunicorn
from app import app

gunicorn app:app

