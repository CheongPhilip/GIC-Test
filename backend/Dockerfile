# Use a base image with Node.js
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the working directory to /app/backend
WORKDIR /app/backend

# Install backend-specific dependencies if any
RUN npm install

# Build the backend
RUN npm run build

# Expose the port the app runs on
EXPOSE 4000

# Run the application
CMD ["npm", "run", "start"]