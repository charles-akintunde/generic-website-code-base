# Use official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the entire project to the working directory inside the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 80
EXPOSE 80

# Start the Next.js app on port 80
CMD ["npm", "run", "start", "--", "-p", "80"]
