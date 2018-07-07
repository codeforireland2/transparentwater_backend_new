# See the used tutorial at https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# See also the cheat sheet at https://docs.docker.com/get-started/#recap-and-cheat-sheet
# Selecting Docker image for version 10
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install MongoDB
# Note: Commands should be structured from least changed to most often changed
# To do: Move MongoDB to a separate database container
# RUN apt-get update && \
#  apt-get install -y --no-install-recommends \
#  mongodb \
#  mongodb-server \
#  && rm -rf /var/lib/apt/lists/*

# Create MongoDB default data file
# RUN mkdir -p /data/db

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# If you are building your code for production
# RUN npm install --only=production
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 8080

# Start service
# CMD [ "npm", "start" ]
