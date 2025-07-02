# PDF to PowerPoint Converter

A modern, full-stack web application that converts PDF documents to PowerPoint presentations with a sleek React frontend and robust Python Flask backend.

## 🚀 Project Overview

This application provides an intuitive interface for users to upload PDF files and convert them to PowerPoint presentations. The system processes PDFs by extracting text blocks and organizing them into properly formatted slides.

## 🛠️ Technologies Used

### Frontend
- **React 19** with Vite for fast development
- **Tailwind CSS** for responsive styling
- **Framer Motion** for smooth animations
- **Lucide React** for consistent iconography
- **Zustand** for state management
- **React Router DOM** for navigation

### Backend
- **Python Flask** as the web framework
- **PyMuPDF (fitz)** for PDF text extraction
- **python-pptx** for PowerPoint generation
- **Flask-CORS** for cross-origin requests
- **Gunicorn** as WSGI server
- **Threading** for background processing

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for multi-service orchestration
- **Caddy** as reverse proxy and web server
- **Google Cloud Platform VM** for hosting
- **Alpine Linux** containers for optimized size

## 📁 Project Structure

```
pdf-to-pptx-converter/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client modules
│   │   └── utils/          # Utility functions
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile
│   └── Procfile          # Heroku deployment config
├── docker-compose.yml     # Multi-service configuration
├── Caddyfile             # Reverse proxy configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Docker** (version 20.0 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** for cloning the repository

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdf-to-pptx-converter
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - Health check: http://localhost/health

### Development Setup

For local development without Docker:

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

#### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:8000
```

## 🐳 Docker Configuration

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p uploads converted
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "app:app"]
```

### Docker Compose Services

The application consists of three main services:

1. **Frontend** (React + Vite)
   - Serves the user interface
   - Built with Node.js Alpine image
   - Includes health checks

2. **Backend** (Flask + Python)
   - Handles PDF processing and conversion
   - Built with Python slim image
   - Persistent volumes for file storage

3. **Caddy** (Reverse Proxy)
   - Routes requests to appropriate services
   - Handles SSL termination
   - Serves static files

## 🌐 Deployment on Google Cloud Platform

### VM Setup

1. **Create a VM instance**
   ```bash
   gcloud compute instances create pdf-converter-vm \
     --zone=us-central1-a \
     --machine-type=e2-medium \
     --subnet=default \
     --network-tier=PREMIUM \
     --image=ubuntu-2004-focal-v20231213 \
     --image-project=ubuntu-os-cloud \
     --boot-disk-size=20GB \
     --tags=http-server,https-server
   ```

2. **Configure firewall rules**
   ```bash
   gcloud compute firewall-rules create allow-http \
     --allow tcp:80 \
     --source-ranges 0.0.0.0/0 \
     --tags http-server

   gcloud compute firewall-rules create allow-https \
     --allow tcp:443 \
     --source-ranges 0.0.0.0/0 \
     --tags https-server
   ```

3. **SSH into the VM**
   ```bash
   gcloud compute ssh pdf-converter-vm --zone=us-central1-a
   ```

### VM Configuration

1. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   ```

2. **Clone and deploy**
   ```bash
   git clone <repository-url>
   cd pdf-to-pptx-converter
   docker-compose up -d --build
   ```

3. **Verify deployment**
   ```bash
   docker-compose ps
   curl http://localhost/health
   ```

## 🔧 Reverse Proxy Configuration

The Caddyfile configures routing:

```caddyfile
:80 {
    handle /health {
        respond "OK" 200
    }

    handle /api/* {
        reverse_proxy backend:8000
    }

    handle {
        reverse_proxy frontend:3000
    }
}
```

This configuration:
- Routes `/api/*` requests to the Flask backend
- Routes all other requests to the React frontend
- Provides a health check endpoint
- Handles CORS and SSL automatically

## 📊 API Endpoints

### Upload PDF
```http
POST /api/upload
Content-Type: multipart/form-data

Response: { "uploadId": "uuid" }
```

### Check Status
```http
GET /api/status/{uploadId}

Response: { 
  "status": "processing|completed|error",
  "progress": 0-100,
  "downloadUrl": "/api/download/{uploadId}" 
}
```

### Get Result
```http
GET /api/result/{uploadId}

Response: {
  "downloadUrl": "/api/download/{uploadId}",
  "filename": "converted-presentation.pptx",
  "fileSize": 1234567
}
```

### Download File
```http
GET /api/download/{uploadId}

Response: PowerPoint file stream
```

## 🔍 Monitoring and Health Checks

- **Application Health**: `GET /health`
- **Backend Health**: `GET /api/health`
- **Docker Health Checks**: Configured for all services
- **Container Logs**: `docker-compose logs -f [service]`

## 🛡️ Security Features

- File type validation (PDF only)
- Secure filename handling
- CORS configuration for trusted origins
- Temporary file cleanup
- No persistent storage of sensitive data

## 🚀 Performance Optimizations

- **Multi-worker Gunicorn** for concurrent request handling
- **Background processing** with threading
- **Alpine Linux** images for smaller container sizes
- **Efficient file handling** with temporary storage
- **Health checks** for service reliability

## 🔧 Environment Variables

Set these in your deployment environment:

```bash
VM_EXTERNAL_IP=<your-vm-external-ip>
FLASK_ENV=production
PYTHONUNBUFFERED=1
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   sudo netstat -tlnp | grep :80
   docker-compose down && docker-compose up
   ```

2. **Permission issues**
   ```bash
   sudo chown -R $USER:$USER uploads converted
   sudo chmod 755 uploads converted
   ```

3. **Container health checks failing**
   ```bash
   docker-compose logs backend
   docker-compose restart backend
   ```

4. **File upload issues**
   - Check file size limits
   - Verify file type restrictions
   - Check available disk space

## 📈 Scaling Considerations

- Increase Gunicorn workers for higher concurrency
- Use external storage (AWS S3, Google Cloud Storage) for file handling
- Implement Redis for session management
- Add load balancing for multiple VM instances
- Use managed databases for conversion tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PyMuPDF** for PDF processing capabilities
- **python-pptx** for PowerPoint generation
- **Caddy** for simple reverse proxy setup
- **Docker** for containerization
- **Google Cloud Platform** for hosting infrastructure

---

**🎉 Ready for production deployment!**

This application is fully containerized and ready to deploy on any Docker-compatible platform. The included configurations provide a robust, scalable solution for PDF to PowerPoint conversion.