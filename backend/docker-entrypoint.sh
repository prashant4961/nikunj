#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "Seeding catalogue (existing rows are updated, not duplicated)..."
  node dist/prisma/seed.js
fi

exec "$@"
