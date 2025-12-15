# CURSOR CONTEXT — READ FIRST

You are working inside the `cmdms-backend` folder only.

## Source of Truth
- Old Laravel reference lives in: `../cmkpebook` (Laravel Blade + PHP + MySQL)
- New implementation MUST be written ONLY inside: `cmdms-backend`

## Rules
- Do NOT modify files inside `cmkpebook`
- Use `cmkpebook` ONLY as a database schema and business logic reference
- Study Laravel models, migrations, and controllers to understand:
  - Database relationships
  - Entity structures
  - Business logic flows
  - Validation rules
- Replicate functionality using NestJS best practices
- Do NOT redesign or modernize architecture without explicit requirements
- Database naming: snake_case (user_departments, created_at)
- TypeScript naming: camelCase (userDepartments, createdAt)
- Entity classes: PascalCase (User, Department, Minute)

## Stack (Fixed)
- NestJS (latest)
- TypeORM
- PostgreSQL
- Passport JWT for authentication
- class-validator for DTO validation
- class-transformer for DTO transformation
- Swagger for API documentation
- Multer for file uploads

## Reference Files
- Laravel Models: `../cmkpebook/app/Models/` (89 models)
- Laravel Migrations: `../cmkpebook/database/migrations/` (187 migrations)
- Laravel Enums: `../cmkpebook/app/Enums/`
- Laravel Controllers: `../cmkpebook/app/Http/Controllers/` (business logic)

## Development Approach
1. Always reference Laravel code for schema accuracy
2. Study relationships in Laravel models before creating TypeORM entities
3. Examine migrations for exact column names, types, and constraints
4. Review controllers for business logic patterns
5. Adapt Laravel patterns to NestJS/TypeORM best practices
6. Use TypeORM decorators (@Entity, @Column, @ManyToOne, @ManyToMany, etc.)
7. Implement DTOs with class-validator decorators
8. Use Guards for authentication/authorization (JwtAuthGuard, RolesGuard, PermissionsGuard)
9. Use Interceptors for logging and response transformation
10. Use Pipes for validation and transformation

## Key Concepts
- **Polymorphic Relations**: Tags (taggable), Tasks (taskable), Attachments (attachable)
- **Multi-Department Tracking**: Many modules have department-specific status via pivot tables
- **Audit Trail**: All entities track createdBy, modifiedBy, createdAt, updatedAt
- **Soft Deletes**: Some entities support soft deletion
- **File Management**: JSON arrays for attachments, organized storage by module
- **Department Scoping**: Users see only their department's data (via guards/scopes)
- **Status Enum**: DecisionStatus used across multiple modules

## API Design
- RESTful endpoints
- Standard CRUD operations
- Nested routes for relationships (e.g., /meetings/:id/minutes)
- Query parameters for filtering, pagination, sorting
- Consistent response format: { success: boolean, message: string, data: any, metadata?: any }
- HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error)

## Project Structure
```
cmdms-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/              # Configuration files
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Auth, roles, permissions guards
│   │   ├── interceptors/    # Logging, response transformation
│   │   ├── filters/         # Exception filters
│   │   ├── pipes/           # Validation pipes
│   │   └── enums/           # System-wide enums
│   ├── database/
│   │   ├── migrations/      # TypeORM migrations
│   │   ├── seeds/           # Database seeders
│   │   └── factories/       # Data factories for testing
│   └── modules/             # Feature modules
│       ├── auth/
│       ├── users/
│       ├── roles/
│       ├── permissions/
│       ├── departments/
│       ├── meetings/
│       ├── minutes/
│       ├── directives/
│       ├── announcements/
│       ├── complaints/
│       ├── issues/
│       ├── board-meetings/
│       ├── sectorial-meetings/
│       ├── ptf/
│       ├── khushhal-kpk/
│       ├── schemes/
│       ├── senate-meetings/
│       ├── cm-remarks/
│       ├── interventions/
│       ├── public-days/
│       ├── welfare/
│       ├── inaugurations/
│       ├── candidates/
│       ├── officers/
│       ├── tasks/
│       ├── kpi/
│       ├── letters/
│       ├── tags/
│       ├── activity-logs/
│       ├── notifications/
│       └── reports/
├── test/
├── .env
├── .env.example
└── package.json
```

## Important Notes
- This is a complete rewrite, not a port
- Focus on clean architecture and maintainability
- Follow NestJS module pattern strictly
- Keep controllers thin, services fat
- Use repositories for database operations
- Implement proper error handling
- Add comprehensive logging
- Write unit tests for services
- Use DTOs for all request/response data
- Validate all inputs
- Secure all endpoints with proper guards
- Implement rate limiting for API endpoints
- Use transactions for multi-step database operations
- Cache frequently accessed data where appropriate

