# GitHub CI/CD Setup

## ✅ Workflows yang Telah Ditambahkan

### 1. **Test Workflow** 🧪
File: `.github/workflows/test.yml`
- **Testing**: Unit tests dengan Vitest
- **Linting**: ESLint dan Prettier checks
- **Type Checking**: TypeScript type checking
- **Security**: Security audit dan dependency check
- **Lighthouse**: Performance testing untuk PR
- **Matrix Testing**: Node.js 18.x dan 20.x

### 2. **Build & Deploy Workflow** 🚀
File: `.github/workflows/build-deploy.yml`
- **Build**: Production build dengan artifact upload
- **Staging Deploy**: Deploy ke staging environment
- **Production Deploy**: Deploy ke production environment
- **Vercel Deploy**: Deploy ke Vercel platform
- **Netlify Deploy**: Deploy ke Netlify platform
- **Release Creation**: Otomatis create GitHub release

### 3. **Docker Workflow** 🐳
File: `.github/workflows/docker.yml`
- **Multi-arch Build**: Linux AMD64 dan ARM64
- **Container Registry**: Push ke GitHub Container Registry
- **Security Scan**: Trivy vulnerability scanning
- **SBOM Generation**: Software Bill of Materials
- **Staging Deploy**: Deploy Docker image ke staging
- **Production Deploy**: Deploy Docker image ke production

### 4. **Code Quality Workflow** 🔍
File: `.github/workflows/code-quality.yml`
- **Linting**: ESLint, Prettier, Stylelint
- **Type Checking**: TypeScript type checking
- **Dependency Review**: Security review untuk dependencies
- **CodeQL**: GitHub CodeQL security analysis
- **SonarCloud**: Code quality analysis
- **Bundle Analysis**: Bundle size analysis
- **Performance Testing**: Lighthouse performance tests
- **Accessibility Testing**: Pa11y accessibility tests

### 5. **Release Workflow** 📦
File: `.github/workflows/release.yml`
- **Version Management**: Otomatis version bumping
- **Changelog Generation**: Generate changelog dari git commits
- **NPM Publish**: Publish package ke NPM registry
- **Docker Release**: Build dan push Docker image
- **GitHub Release**: Create GitHub release dengan assets
- **Notification**: Success/failure notifications

## 🎯 Detail Implementasi

### **Test Workflow Features**
```yaml
# Matrix testing dengan multiple Node.js versions
strategy:
  matrix:
    node-version: [18.x, 20.x]

# Comprehensive testing
- name: Run linter
  run: npm run lint

- name: Run type check
  run: npm run type-check

- name: Run tests
  run: npm run test:unit

- name: Run build test
  run: npm run build
```

### **Build & Deploy Features**
```yaml
# Environment-based deployment
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  environment: staging

deploy-production:
  if: github.ref == 'refs/heads/main'
  environment: production

# Multiple deployment targets
- Vercel deployment
- Netlify deployment
- Custom server deployment
```

### **Docker Features**
```yaml
# Multi-platform builds
platforms: linux/amd64,linux/arm64

# Security scanning
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master

# SBOM generation
- name: Generate SBOM
  uses: anchore/sbom-action@v0
```

### **Code Quality Features**
```yaml
# Multiple quality checks
- ESLint linting
- Prettier formatting
- TypeScript type checking
- Dependency security review
- CodeQL security analysis
- SonarCloud quality analysis
- Bundle size analysis
- Performance testing
- Accessibility testing
```

## 🔧 Configuration Files

### **Audit Configuration**
File: `audit-ci.json`
```json
{
  "low": true,
  "moderate": true,
  "high": true,
  "critical": true,
  "allowlist": [],
  "skip-dev": false,
  "report-type": "summary",
  "output-format": "text",
  "pass-enoaudit": true
}
```

### **Lighthouse Configuration**
File: `lighthouse.config.js`
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      startServerCommand: 'npm run preview',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
  },
};
```

## 🐳 Docker Setup

### **Production Dockerfile**
```dockerfile
# Multi-stage build
FROM node:20-alpine AS base
FROM base AS deps
FROM base AS builder
FROM nginx:alpine AS runner

# Features:
- Multi-stage build untuk optimasi size
- Nginx untuk serving static files
- Health check endpoint
- Security headers
- Gzip compression
```

### **Development Dockerfile**
```dockerfile
FROM node:20-alpine
# Features:
- Development server
- Hot reload support
- Volume mounting untuk development
```

### **Docker Compose**
```yaml
services:
  app:        # Production build
  dev:        # Development server
  nginx:      # Reverse proxy
```

### **Nginx Configuration**
```nginx
# Features:
- Vue.js SPA routing support
- Static asset caching
- Gzip compression
- Security headers
- API proxy support
- Health check endpoint
```

## 📊 Package.json Scripts

### **Development Scripts**
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### **Quality Scripts**
```json
{
  "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
  "format": "prettier --write src/",
  "format:check": "prettier --check src/",
  "type-check": "vue-tsc --noEmit",
  "stylelint": "stylelint \"src/**/*.{css,scss,vue}\" --fix"
}
```

### **Testing Scripts**
```json
{
  "test:unit": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

### **Docker Scripts**
```json
{
  "docker:build": "docker build -t scaffolding-dashboard .",
  "docker:run": "docker run -p 3000:80 scaffolding-dashboard",
  "docker:dev": "docker-compose up dev",
  "docker:prod": "docker-compose up app"
}
```

## 🚀 Workflow Triggers

### **Test Workflow**
- **Push**: `main`, `develop` branches
- **Pull Request**: `main`, `develop` branches

### **Build & Deploy Workflow**
- **Push**: `main` branch
- **Manual**: `workflow_dispatch`

### **Docker Workflow**
- **Push**: `main`, `develop` branches
- **Tags**: `v*` tags
- **Pull Request**: `main` branch

### **Code Quality Workflow**
- **Push**: `main`, `develop` branches
- **Pull Request**: `main`, `develop` branches

### **Release Workflow**
- **Tags**: `v*` tags
- **Manual**: `workflow_dispatch`

## 🔐 Required Secrets

### **GitHub Secrets**
```bash
# NPM
NPM_TOKEN=your_npm_token

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Netlify
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_netlify_site_id

# SonarCloud
SONAR_TOKEN=your_sonarcloud_token
```

### **Environment Variables**
```bash
# Build
NODE_VERSION=20.x
NODE_ENV=production

# Docker
REGISTRY=ghcr.io
IMAGE_NAME=your-username/scaffolding-dashboard
```

## 📈 Benefits

### **For Development**
- **Automated Testing**: Semua tests berjalan otomatis
- **Code Quality**: Linting dan formatting otomatis
- **Security**: Security scanning otomatis
- **Performance**: Performance testing otomatis
- **Accessibility**: Accessibility testing otomatis

### **For Deployment**
- **Automated Builds**: Build otomatis untuk setiap push
- **Multi-Environment**: Staging dan production deployment
- **Multi-Platform**: Docker images untuk multiple architectures
- **Rollback Support**: Easy rollback dengan GitHub releases
- **Monitoring**: Health checks dan monitoring

### **For Security**
- **Dependency Scanning**: Otomatis scan dependencies
- **Vulnerability Scanning**: Container vulnerability scanning
- **Code Analysis**: CodeQL security analysis
- **SBOM Generation**: Software Bill of Materials
- **Audit Trail**: Complete audit trail untuk semua deployments

## 🔮 Usage Examples

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:unit

# Run linting
npm run lint

# Build for production
npm run build
```

### **Docker Development**
```bash
# Development with Docker
npm run docker:dev

# Production build
npm run docker:build
npm run docker:run

# Docker Compose
docker-compose up dev
docker-compose up app
```

### **CI/CD Workflow**
```bash
# Push to trigger workflows
git push origin main

# Create release
git tag v1.0.0
git push origin v1.0.0

# Manual workflow dispatch
# Go to GitHub Actions → Release → Run workflow
```

### **Deployment**
```bash
# Staging deployment (develop branch)
git push origin develop

# Production deployment (main branch)
git push origin main

# Release deployment (tags)
git tag v1.0.0
git push origin v1.0.0
```

## 📊 Workflow Status

### **Success Indicators**
- ✅ All tests passing
- ✅ No linting errors
- ✅ No security vulnerabilities
- ✅ Performance scores above threshold
- ✅ Accessibility scores above threshold
- ✅ Successful deployment

### **Failure Indicators**
- ❌ Test failures
- ❌ Linting errors
- ❌ Security vulnerabilities
- ❌ Performance below threshold
- ❌ Deployment failures

Semua GitHub CI/CD workflows telah berhasil diimplementasikan dengan konfigurasi yang komprehensif untuk testing, building, deployment, dan code quality!
