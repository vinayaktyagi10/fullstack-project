FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# ✅ Install all dependencies (not just production ones)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the app
RUN npm run build

