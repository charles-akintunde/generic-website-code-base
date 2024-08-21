# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 for the Next.js application
EXPOSE 3000

# Set environment variables
ENV HOST=127.0.0.1
ENV PORT=3000

# Command to run the Next.js development server with nodemon
CMD ["npx", "nodemon", "--watch", ".", "--exec", "next", "dev", "--experimental-https"]
