FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy the entire project
COPY . .

# Install dependencies at the root level
RUN npm install

# Generate Prisma client
WORKDIR /usr/src/app/apps/payment-service
RUN npx prisma generate

# Stay in the transaction service directory
# Command to run the service
CMD ["npm", "run", "start:dev"]