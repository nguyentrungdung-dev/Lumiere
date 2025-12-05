# Frontend Dockerfile for Lumiere
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost:8000
ARG VITE_API_BASE_PATH=/api/v1

# Set as environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_PATH=$VITE_API_BASE_PATH

# Copy package files
COPY package*.json ./

# Install dependencies using yarn (more reliable than npm with 5 minute timeout)
RUN yarn install --network-timeout 300000

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

