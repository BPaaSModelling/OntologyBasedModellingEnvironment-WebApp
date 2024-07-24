# Use the official Node.js image from the Docker Hub
FROM node:16-alpine
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json files
COPY package*.json ./
# Install Angular CLI
RUN npm install -g @angular/cli@10
COPY . .
# Install dependencies
RUN npm install --legacy-peer-deps
# Build the Angular application
RUN ng build
# Expose the port the app runs on
EXPOSE 4200
# Command to run the application
CMD ["npm", "start"]
