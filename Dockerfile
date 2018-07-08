# See the used tutorial at https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# See also the cheat sheet at https://docs.docker.com/get-started/#recap-and-cheat-sheet
# And https://medium.com/statuscode/dockerising-a-node-js-and-mongodb-app-d22047e2806f
# Selecting Docker image for version 10
FROM node:10

# Create app directory
WORKDIR /usr/src/app

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
CMD [ "npm", "start" ]
