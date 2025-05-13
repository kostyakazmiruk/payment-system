FROM node:20

WORKDIR /usr/src/app

# Copy package manager files from the root
COPY package*.json ./
RUN npm install

# Copy only the service code
COPY apps/api-gateway/ ./

CMD ["npm", "run", "start:dev"]
