# CMDMS Backend - Deployment Guide

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Docker & Docker Compose (optional)
- npm or yarn

---

## 🚀 Quick Start (Development)

### 1. Clone & Install

```bash
cd cmdms-backend
npm install
```

### 2. Environment Setup

Create `.env` file:

```env
# Application
NODE_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=cmdms_user
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=cmdms_db

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h

# File Upload
UPLOAD_DIRECTORY=./uploads
MAX_FILE_SIZE=10485760
```

### 3. Start Database

**Option A: Docker**
```bash
docker-compose up -d postgres
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb cmdms_db

# Or using psql
psql -U postgres
CREATE DATABASE cmdms_db;
\q
```

### 4. Run Seeders

```bash
npm run seed
```

Expected output:
```
✓ Created province: Khyber Pakhtunkhwa
✓ Created 27 districts
✓ Created 6 department types
✓ Created default department: CM Secretariat
✓ Created 7 meeting types
✓ Created 7 roles
✓ Created 60+ permissions
✓ Created admin user
  Email: admin@cmdms.gov.pk
  Password: Admin@123
```

### 5. Start Application

```bash
npm run start:dev
```

Application will run on: `http://localhost:3000`

---

## 📚 API Documentation

Access Swagger docs at: `http://localhost:3000/api/docs`

---

## 🔐 Default Credentials

```
Email: admin@cmdms.gov.pk
Password: Admin@123
```

⚠️ **Change this password immediately after first login!**

---

## 🐳 Docker Deployment

### Full Stack with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Services:
- **Backend:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379 (if enabled)
- **Nginx:** http://localhost:80 (reverse proxy)

### Run Seeders in Docker

```bash
docker-compose exec backend npm run seed
```

---

## 🗄️ Database Management

### Generate Migration

```bash
npm run migration:generate -- src/database/migrations/MigrationName
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Migration

```bash
npm run migration:revert
```

---

## 📦 Production Build

### 1. Build Application

```bash
npm run build
```

### 2. Set Production Environment

Update `.env`:
```env
NODE_ENV=production
DATABASE_SYNCHRONIZE=false
```

### 3. Start Production Server

```bash
npm run start:prod
```

---

## 🔧 Configuration

### Database Connection

TypeORM configuration in `ormconfig.ts`:
- Uses environment variables
- Snake case naming strategy
- Entities auto-loaded
- Migrations support

### JWT Configuration

In `src/config/jwt.config.ts`:
- Secret from environment
- Configurable expiration
- Bearer token authentication

### File Uploads

Configuration in `src/config/app.config.ts`:
- Max file size: 10MB
- Upload directory: `./uploads`
- Support for images, PDFs, documents

---

## 🛡️ Security Checklist

### Before Going to Production:

- [ ] Change default admin password
- [ ] Update JWT secret with strong random key
- [ ] Set `DATABASE_SYNCHRONIZE=false`
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable helmet middleware
- [ ] Configure CSP headers
- [ ] Set up logging/monitoring
- [ ] Regular backups
- [ ] Update all dependencies

---

## 📊 Health Check

### Check API Health

```bash
curl http://localhost:3000/api/docs
```

### Check Database Connection

```bash
psql -h localhost -U cmdms_user -d cmdms_db -c "SELECT 1;"
```

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)
```

### Database Connection Error

1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Ensure database exists

### Seeder Fails

```bash
# Drop and recreate database
dropdb cmdms_db
createdb cmdms_db
npm run seed
```

### Module Not Found

```bash
npm install
npm run build
```

---

## 📈 Performance Optimization

### Production Optimizations:

1. **Enable Caching**
   - Redis for session storage
   - Query result caching

2. **Database Indexing**
   - Add indexes on frequently queried columns
   - Composite indexes for complex queries

3. **Connection Pooling**
   - Configure TypeORM connection pool
   - Max: 20 connections

4. **Compression**
   - Enable gzip compression
   - Minify responses

5. **Load Balancing**
   - Use PM2 for clustering
   - Nginx for reverse proxy

---

## 🔄 Backup & Restore

### Backup Database

```bash
pg_dump -U cmdms_user -d cmdms_db > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql -U cmdms_user -d cmdms_db < backup_20250115.sql
```

---

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | development | Yes |
| `APP_PORT` | Application port | 3000 | Yes |
| `DATABASE_HOST` | PostgreSQL host | localhost | Yes |
| `DATABASE_PORT` | PostgreSQL port | 5432 | Yes |
| `DATABASE_USER` | Database user | - | Yes |
| `DATABASE_PASSWORD` | Database password | - | Yes |
| `DATABASE_NAME` | Database name | - | Yes |
| `JWT_SECRET` | JWT signing key | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration | 24h | Yes |
| `UPLOAD_DIRECTORY` | File upload path | ./uploads | No |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 10485760 | No |

---

## 🎯 Next Steps

1. **Frontend Integration**
   - Use Swagger docs for API reference
   - Implement authentication flow
   - Test all endpoints

2. **Data Migration**
   - Import existing data from Laravel
   - Validate data integrity
   - Test relationships

3. **Testing**
   - Unit tests for services
   - E2E tests for APIs
   - Load testing

4. **Monitoring**
   - Set up logging (Winston/Pino)
   - Configure APM (New Relic/DataDog)
   - Set up alerts

---

**Support:** For issues, refer to `README.md` or check documentation.

*Last Updated: December 2025*

