## Legacy Data Migration Endpoint

An open endpoint has been created to trigger the legacy data migration on the live server.

### Endpoint Details
- **URL**: `/migration/legacy`
- **Method**: `POST`
- **Auth**: Public (No authentication required)

### How to Trigger
You can trigger the migration using `curl` or any HTTP client (Postman, etc.):

```bash
curl -X POST https://your-backend-url.com/migration/legacy
```

### Prerequisites
1.  Ensure the file `legacy-data/cmkpebooktm_2025-12-16_00-00-01.sql.gz` is present on the server (it is configured to be copied to `dist/src/legacy-data` during build).
2.  The database connection must be valid.

### What it does
1.  Drops conflicting tables (`department_types`, `districts`, `interventions`, `activities`, `activity_department`).
2.  Creates missing tables (`interventions`, `activities`, `activity_department`).
3.  Migrates data from the SQL dump file.
4.  Updates sequences.

**Warning**: This operation modifies the database schema and data. Ensure you have a backup if needed.

