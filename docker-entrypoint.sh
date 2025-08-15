#!/bin/sh

echo "Waiting for database..."

# Wait for database to be ready
until nc -z mysql-db 3306; do
  echo "Waiting for database connection..."
  sleep 2
done

echo "Database is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Generate Prisma client if needed
echo "Generating Prisma client..."
npx prisma generate

echo "Starting application..."
exec node dist/main
