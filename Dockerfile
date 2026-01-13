# Build stage for backend
FROM node:18-slim AS backend-build

WORKDIR /app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

COPY backend/package*.json ./
RUN npm ci

# Copy ALL prisma folder including migrations subdirectory
COPY backend/prisma/ ./prisma/
RUN npx prisma generate

COPY backend/ ./
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package files and install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy ALL prisma schema AND migrations folder
COPY backend/prisma/ ./prisma/

# Copy built files from build stage
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 5000

# Start command - run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
