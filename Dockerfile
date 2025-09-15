# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install ffmpeg for audio conversion
RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy app source code
COPY dist ./dist

# The puppeteer chromium browser will be downloaded on the first run
# We create a directory for the session data to persist it
RUN mkdir .wwebjs_auth
VOLUME .wwebjs_auth

# Your app binds to port 3000, but this is not an HTTP app, so no EXPOSE needed

# Command to run the application
CMD [ "node", "dist/index.js" ]
