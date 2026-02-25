FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma Client
RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Expose API port
EXPOSE 3001

# Start: apply migrations, then start server
CMD npm start
