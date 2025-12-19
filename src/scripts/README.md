# Migration Scripts

This directory contains scripts for migrating legacy MySQL data to the new PostgreSQL structure.

## Available Scripts

### 1. Pre-Migration Check (`pre-migration-check.ts`)

**Command**: `npm run check:migration`

Verifies system readiness before migration:
- ✅ Checks if legacy SQL file exists
- ✅ Tests database connectivity
- ✅ Verifies schema is deployed
- ✅ Estimates disk space requirements
- ⚠️ Warns about existing data conflicts

**Always run this first!**

### 2. Simple Migration (`migrate-legacy-simple.ts`)

**Command**: `npm run migrate:legacy:simple`

**Recommended for most users**

Features:
- Decompresses .sql.gz file
- Converts MySQL syntax to PostgreSQL
- Creates intermediate SQL file for inspection
- Executes all statements
- Updates ID sequences
- Provides detailed statistics

Process:
1. Decompress: `cmkpebooktm_2025-12-16_00-00-01.sql.gz` → `converted_postgresql.sql`
2. Convert MySQL → PostgreSQL syntax
3. Execute SQL statements
4. Update sequences

### 3. Advanced Migration (`migrate-legacy-data.ts`)

**Command**: `npm run migrate:legacy`

**For advanced users and large datasets**

Features:
- Streams SQL file (memory efficient)
- Batch processing (100 records/batch)
- Table name mapping
- Graceful error handling
- Per-table statistics
- Conflict resolution (ON CONFLICT DO NOTHING)

Better for:
- Large databases (>1GB)
- Production environments
- Memory-constrained systems

## Usage

### Quick Start

```bash
# 1. Check readiness
npm run check:migration

# 2. Run migration
npm run migrate:legacy:simple

# 3. Start application
npm run start:dev
```

### With Network Permission

If you need network access (the scripts do):

```bash
# The scripts require network to connect to Railway PostgreSQL
npm run check:migration
npm run migrate:legacy:simple
```

## File Structure

```
src/
├── scripts/
│   ├── pre-migration-check.ts      # Pre-flight checks
│   ├── migrate-legacy-simple.ts    # Simple migration (recommended)
│   ├── migrate-legacy-data.ts      # Advanced migration
│   └── README.md                   # This file
└── legacy-data/
    ├── cmkpebooktm_2025-12-16_00-00-01.sql.gz    # Source (75MB)
    └── converted_postgresql.sql                   # Generated during migration
```

## Data Conversions

### Table Name Mappings

Some legacy tables are renamed in the new schema:

| Legacy                | New                        |
|-----------------------|----------------------------|
| `board_details`       | `boards`                   |
| `directive_replies`   | `directive_responses`      |
| `announcement_replies`| `announcement_responses`   |
| `complaint_replies`   | `complaint_responses`      |
| `cm_ptf_responses`    | `ptf_responses`            |
| `khushhal_kpks`       | `khushhal_tasks`           |
| `costs`               | `scheme_costings`          |
| `allocations`         | `scheme_budgets`           |
| `expenditures`        | `scheme_expenditures`      |
| `tasks_tasks`         | `tasks`                    |

### Data Type Conversions

MySQL → PostgreSQL type mapping:

| MySQL              | PostgreSQL  |
|--------------------|-------------|
| `BIGINT UNSIGNED`  | `BIGINT`    |
| `INT UNSIGNED`     | `INTEGER`   |
| `TINYINT(1)`       | `BOOLEAN`   |
| `TINYINT`          | `SMALLINT`  |
| `DATETIME`         | `TIMESTAMP` |
| `LONGTEXT`         | `TEXT`      |
| `MEDIUMTEXT`       | `TEXT`      |

### Syntax Conversions

- Backticks (`) → Double quotes (")
- `ENGINE=InnoDB` → Removed
- `CHARACTER SET` → Removed
- `COLLATE` → Removed
- `AUTO_INCREMENT` → Removed (handled by sequences)

## Migration Statistics

After successful migration, you should see:

```
📊 Migration Statistics:
═══════════════════════════════════════════════════════════
📄 Lines processed: 302,627
📋 Tables found: 170+
📝 INSERT statements converted: 50,000+
✅ Records inserted: 48,523
❌ Errors: 12 (conflicts/skipped)
═══════════════════════════════════════════════════════════
```

## Troubleshooting

### Common Issues

#### 1. File Not Found
```
Error: Legacy SQL file not found
```
**Solution**: Verify file exists at `src/legacy-data/cmkpebooktm_2025-12-16_00-00-01.sql.gz`

#### 2. Connection Failed
```
Error: Connection refused
```
**Solution**: 
- Check internet connection
- Verify database URL is correct
- Ensure Railway service is running

#### 3. Schema Mismatch
```
Error: column "xyz" does not exist
```
**Solution**: Run migrations first: `npm run migration:run`

#### 4. Duplicate Keys
```
Error: duplicate key value violates unique constraint
```
**Solution**: Database has existing data. Scripts use `ON CONFLICT DO NOTHING` to skip duplicates.

#### 5. Disk Space
```
Error: ENOSPC: no space left on device
```
**Solution**: Free up ~500MB disk space (10x the compressed file size)

### Debug Mode

To see detailed SQL execution:

1. Edit the script
2. Set `logging: true` in DataSource config
3. Check console output for SQL statements

### Manual Inspection

After migration, inspect the converted SQL file:

```bash
# View first 100 lines
head -100 src/legacy-data/converted_postgresql.sql

# Search for specific table
grep -A 10 "CREATE TABLE users" src/legacy-data/converted_postgresql.sql

# Count INSERT statements
grep -c "INSERT INTO" src/legacy-data/converted_postgresql.sql
```

## Performance Tips

### For Large Datasets

1. **Run during off-peak hours**
2. **Use advanced migration script** (streaming, less memory)
3. **Increase PostgreSQL limits** temporarily:
   ```sql
   SET maintenance_work_mem = '1GB';
   SET max_wal_size = '2GB';
   ```

### For Better Speed

- Close unnecessary applications
- Use wired connection (not WiFi)
- Run on server with good I/O performance
- Consider parallel processing for very large datasets

## Rollback

If migration fails or produces incorrect data:

### Option 1: Restore from Backup
```bash
psql $DB_URL < backup.sql
```

### Option 2: Clear Specific Tables
```sql
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE departments CASCADE;
-- etc.
```

### Option 3: Revert Migrations
```bash
npm run migration:revert
npm run migration:run  # Re-run to fresh state
```

## Security

⚠️ **Important Security Notes**:

1. **Database URL contains credentials** - Never commit to git
2. **Use environment variables** in production
3. **Rotate passwords** after migration
4. **Secure backup files** - They contain sensitive data
5. **Delete temp files** after successful migration

## Next Steps

After successful migration:

1. ✅ Verify data integrity
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM departments;
   SELECT COUNT(*) FROM minutes;
   ```

2. ✅ Test authentication
   - Try logging in with existing users
   - Verify permissions work correctly

3. ✅ Run application tests
   ```bash
   npm run test
   npm run test:e2e
   ```

4. ✅ Check relationships
   ```sql
   -- Verify foreign keys
   SELECT COUNT(*) FROM minutes WHERE meeting_id NOT IN (SELECT id FROM meetings);
   ```

5. ✅ Monitor performance
   - Check query execution times
   - Verify indexes are used
   - Monitor database connection pool

## Support

For help:
1. Check `MIGRATION_GUIDE.md` for detailed instructions
2. Review console output for specific errors
3. Inspect `converted_postgresql.sql` for syntax issues
4. Connect to database and verify table states

## References

- [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md) - Complete schema documentation
- [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) - Comprehensive migration guide
- [README_MIGRATION.md](../README_MIGRATION.md) - Quick start guide
- [TypeORM Documentation](https://typeorm.io/) - ORM reference
- [PostgreSQL Docs](https://www.postgresql.org/docs/) - Database reference

---

**Questions?** Review the documentation or contact the development team.

