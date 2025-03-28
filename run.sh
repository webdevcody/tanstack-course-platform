#!/bin/bash

# Source environment variables
source .env

npm run build

# Start PM2 with environment variables
pm2 start npm --name "wdc-tanstack-starter-kit" -- start