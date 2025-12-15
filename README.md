# CMDMS Backend (NestJS)

Modern backend implementation for the Chief Minister's Decision Management System (CMDMS) built with NestJS, TypeORM, and PostgreSQL.

## Project Structure

```
cmdms-backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── config/                 # Configuration files
│   ├── common/                 # Shared utilities
│   │   ├── decorators/         # Custom decorators
│   │   ├── guards/             # Authentication & authorization guards
│   │   ├── interceptors/       # Logging, response transformation
│   │   ├── filters/            # Exception filters
│   │   ├── pipes/              # Validation pipes
│   │   ├── enums/              # System-wide enums
│   │   ├── dto/                # Common DTOs
│   │   └── interfaces/         # TypeScript interfaces
│   ├── database/
│   │   ├── migrations/         # TypeORM migrations
│   │   ├── seeds/              # Database seeders
│   │   └── factories/          # Data factories for testing
│   └── modules/                # Feature modules
│       ├── auth/               # Authentication module
│       ├── users/              # Users management
│       ├── roles/              # Roles module
│       ├── permissions/        # Permissions module
│       ├── departments/        # Departments module
│       ├── meetings/           # CM Meetings
│       ├── minutes/            # Meeting Minutes/Decisions
│       └── ... (30+ modules)
├── test/                       # E2E tests
├── ormconfig.ts               # TypeORM configuration
├── CURSOR_CONTEXT.md          # Development guide for Cursor AI
└── package.json
```

## Technology Stack

- **Framework:** NestJS (latest)
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Authentication:** Passport JWT
- **Validation:** class-validator, class-transformer
- **API Documentation:** Swagger/OpenAPI
- **File Upload:** Multer
- **Testing:** Jest

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your database credentials in .env
```

## Database Setup

```bash
# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration
npm run migration:generate src/database/migrations/MigrationName

# Run seeders
npm run seed
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at: `http://localhost:3000/api`

## API Documentation

Once the application is running, access Swagger documentation at:
`http://localhost:3000/api/docs`

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` - PostgreSQL connection
- `JWT_SECRET`, `JWT_EXPIRATION` - JWT configuration
- `PORT` - Application port (default: 3000)

## Development

### Code Structure

- **Entities:** TypeORM entities with decorators
- **DTOs:** Data Transfer Objects for request/response validation
- **Services:** Business logic implementation
- **Controllers:** RESTful API endpoints
- **Guards:** Authentication and authorization
- **Interceptors:** Request/response transformation, logging

### Naming Conventions

- **Database:** snake_case (e.g., `user_departments`, `created_at`)
- **TypeScript:** camelCase (e.g., `userDepartments`, `createdAt`)
- **Classes/Entities:** PascalCase (e.g., `User`, `Department`, `Minute`)

### Reference

This is a complete rewrite of the legacy Laravel monolith (`../cmkpebook/`). For schema reference, see:
- Laravel Models: `../cmkpebook/app/Models/`
- Laravel Migrations: `../cmkpebook/database/migrations/`
- Laravel Enums: `../cmkpebook/app/Enums/`

See `CURSOR_CONTEXT.md` for detailed development guidelines.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Features

### Implemented Modules (30+)

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Permission-based granular access
   - Department-scoped data access

2. **Core Modules**
   - Users, Roles, Permissions
   - Departments & Department Types
   - User Groups

3. **Meeting Systems**
   - CM Meetings & Minutes (Record Notes)
   - Cabinet Meetings
   - Board Meetings
   - Sectorial Meetings
   - Senate Meetings (Universities)
   - Review Meetings

4. **Decision Tracking**
   - Directives Management
   - Announcements System
   - CM Remarks
   - Multi-department status tracking

5. **Public Affairs**
   - Complaints Management
   - Issues (HCM Public Affairs)
   - Public Days

6. **Special Initiatives**
   - PTF (Prime Task Force) System
   - Khushhal KPK Programme
   - PTI Initiatives
   - Interventions Tracker

7. **Development & Finance**
   - Annual Development Schemes
   - Budget Allocations
   - Expenditure Tracking
   - Fund Distribution

8. **Political Management**
   - Candidates (MNA/MPA) Management
   - Constituencies
   - Officers Management
   - Scheme Distribution

9. **Performance Tracking**
   - KPI Tracking System
   - Progress Monitoring
   - Status Management

10. **Supporting Systems**
    - Generic Tasks System (polymorphic)
    - Letters Generation
    - Tagging System (polymorphic)
    - Activity Logs & Audit Trail
    - Notifications (in-app + email)
    - File Upload & Storage
    - Reporting & Analytics (20+ endpoints)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - List users (filtered, paginated)
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)

### Meetings & Minutes
- `GET /api/meetings` - List meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id/minutes` - Get meeting decisions
- `POST /api/meetings/:id/minutes` - Create decision
- `PATCH /api/minutes/:id` - Update decision
- `POST /api/minutes/:id/replies` - Submit department response

### Directives
- `GET /api/directives` - List directives
- `POST /api/directives` - Create directive
- `POST /api/directives/:id/departments` - Assign departments
- `POST /api/directives/:id/replies` - Submit response

### ... (30+ module endpoints)

See Swagger documentation for complete API reference.

## Database Schema

The system manages 170+ tables including:
- Core tables (users, roles, permissions, departments)
- Pivot tables for many-to-many relationships
- Meeting-related tables
- Module-specific tables
- Polymorphic tables (tags, tasks, attachments)
- Audit tables (activity_logs)

## License

Proprietary - Government of Khyber Pakhtunkhwa

## Support

For technical issues or questions, contact the development team.
