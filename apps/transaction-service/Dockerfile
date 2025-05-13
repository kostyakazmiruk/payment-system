FROM node:20

# Set working directory to the root of your monorepo
WORKDIR /usr/src/app

# Copy root-level package manager files
COPY package*.json ./

# Install dependencies from root
RUN npm install

# Copy only the Prisma schema for code generation
COPY apps/transaction-service/prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Switch to the transaction-service directory
WORKDIR /usr/src/app/apps/transaction-service

# Start service in development mode
CMD ["npm", "run", "start:dev"]
