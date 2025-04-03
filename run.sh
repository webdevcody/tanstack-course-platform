#!/bin/bash

# Source environment variables
source .env

npm run db:migrate
npm run start