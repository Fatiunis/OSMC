# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY HOSPITAL_SYSTEM_REACT/package*.json ./
RUN npm install

COPY HOSPITAL_SYSTEM_REACT/ . 


# Copy the rest of your app
COPY . .

# Expose the port Vite/React uses
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
