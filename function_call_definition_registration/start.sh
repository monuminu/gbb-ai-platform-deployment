#!/bin/sh
gunicorn -b 0.0.0.0:8080 app:app --workers 4 --threads 4