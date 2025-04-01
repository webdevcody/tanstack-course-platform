# Use Node.js 20 LTS as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# ENV NODE_OPTIONS="--expose-gc"

# Start the application
CMD ["npm", "start"]
