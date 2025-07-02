# frontend/Dockerfile (Alternative with Vite preview)
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start with Vite preview (built-in server)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
