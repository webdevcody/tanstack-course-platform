#!/bin/bash

if [ -f .env ]; then
    # Read each line from .env file
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip empty lines and comments
        if [[ $line =~ ^[[:space:]]*$ ]] || [[ $line =~ ^# ]]; then
            continue
        fi
        
        # Export the environment variable
        export "$line"
    done < .env
    echo "Environment variables loaded successfully"
else
    echo "Error: .env file not found"
    exit 1
fi

