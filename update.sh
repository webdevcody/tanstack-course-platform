#!/bin/bash

echo "Pulling latest changes"
git pull

echo "Building docker images"
docker compose -f docker-compose.prod.yml up -d --build

echo "Done"
