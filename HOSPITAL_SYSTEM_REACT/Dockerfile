# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app


# 1. Copia SOLO los archivos de dependencias de la subcarpeta
COPY HOSPITAL_SYSTEM_REACT/package*.json ./

# 2. Instala dependencias
RUN npm install

COPY HOSPITAL_SYSTEM_REACT/ . 

# 3. Copia SOLO el contenido de la subcarpeta de React al WORKDIR (/app)
COPY HOSPITAL_SYSTEM_REACT/ .

# Expose the port Vite/React uses
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
