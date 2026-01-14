#!/bin/sh

# wait-for-it logic
echo "Waiting for database at $DB_HOST:3306..."
if [ -z "$DB_HOST" ]; then
  echo "Error: DB_HOST environment variable is not set."
  exit 1
fi

while ! nc -z "$DB_HOST" 3306; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate

# Start the application
echo "Starting application..."
npm start
