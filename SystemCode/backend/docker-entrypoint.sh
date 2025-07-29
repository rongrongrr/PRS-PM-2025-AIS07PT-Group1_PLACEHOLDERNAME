#!/usr/bin/env sh
set -e

cd /app

# 1. unzip only if the pickle is missing
if [ ! -f combined_data.pkl ]; then
  echo "📦  Extracting combined_data.pkl..."
  unzip -o combined_data.pkl.zip
fi

# 2. hand off to uvicorn (PID 1 stays tini → handles signals properly)
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload