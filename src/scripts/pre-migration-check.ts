import { Client } from 'pg';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Pre-Migration Check Script
 * 
 * Verifies system readiness before running legacy data migration
 * 
 * Usage: npm run check:migration
 */

const LEGACY_SQL_FILE = join(__dirname, '../legacy-data/cmkpebooktm_2025-12-16_00-00-01.sql.gz');
const DB_URL = 'postgresql://postgres:SSvMLVufcETbSHtUQSrkTvHbLtfbrdYj@metro.proxy.rlwy.net:29553/railway';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: CheckResult[] = [];

/**
 * Check if legacy SQL file exists and is readable
 */
function checkLegacyFile(): CheckResult {
  try {
    if (!existsSync(LEGACY_SQL_FILE)) {
      return {
        name: 'Legacy SQL File',
        status: 'fail',
        message: `File not found: ${LEGACY_SQL_FILE}`,
      };
    }

    const stats = statSync(LEGACY_SQL_FILE);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    return {
      name: 'Legacy SQL File',
      status: 'pass',
      message: `File found (${sizeMB} MB)`,
    };
  } catch (err) {
    return {
      name: 'Legacy SQL File',
      status: 'fail',
      message: `Error accessing file: ${err.message}`,
    };
  }
}

/**
 * Check database connectivity
 */
async function checkDatabaseConnection(): Promise<CheckResult> {
  const client = new Client({ connectionString: DB_URL });

  try {
    await client.connect();
    const result = await client.query('SELECT version()');
    const version = result.rows[0].version;

    await client.end();

    return {
      name: 'Database Connection',
      status: 'pass',
      message: `Connected successfully\n    ${version}`,
    };
  } catch (err) {
    return {
      name: 'Database Connection',
      status: 'fail',
      message: `Connection failed: ${err.message}`,
    };
  }
}

/**
 * Check disk space
 */
function checkDiskSpace(): CheckResult {
  try {
    const stats = statSync(LEGACY_SQL_FILE);
    const requiredSpace = stats.size * 10; // Estimate 10x for decompression and conversion
    const requiredMB = (requiredSpace / (1024 * 1024)).toFixed(2);

    return {
      name: 'Disk Space',
      status: 'warning',
      message: `Estimated ${requiredMB} MB needed for migration`,
    };
  } catch (err) {
    return {
      name: 'Disk Space',
      status: 'warning',
      message: 'Could not estimate disk space requirements',
    };
  }
}

/**
 * Check if required tables exist in database
 */
async function checkDatabaseSchema(): Promise<CheckResult> {
  const client = new Client({ connectionString: DB_URL });

  try {
    await client.connect();

    // Check for key tables
    const requiredTables = [
      'users',
      'departments',
      'roles',
      'provinces',
      'districts',
    ];

    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = ANY($1)
    `, [requiredTables]);

    const foundTables = result.rows.map((r: any) => r.tablename);
    const missingTables = requiredTables.filter((t) => !foundTables.includes(t));

    await client.end();

    if (missingTables.length === 0) {
      return {
        name: 'Database Schema',
        status: 'pass',
        message: 'All required tables exist',
      };
    } else {
      return {
        name: 'Database Schema',
        status: 'fail',
        message: `Missing tables: ${missingTables.join(', ')}\n    Run: npm run migration:run`,
      };
    }
  } catch (err) {
    return {
      name: 'Database Schema',
      status: 'fail',
      message: `Schema check failed: ${err.message}`,
    };
  }
}

/**
 * Check if database has existing data
 */
async function checkExistingData(): Promise<CheckResult> {
  const client = new Client({ connectionString: DB_URL });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT 
        schemaname,
        tablename,
        n_live_tup as row_count
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
      ORDER BY n_live_tup DESC
      LIMIT 5
    `);

    await client.end();

    const totalRows = result.rows.reduce((sum: number, row: any) => sum + parseInt(row.row_count), 0);

    if (totalRows === 0) {
      return {
        name: 'Existing Data',
        status: 'pass',
        message: 'Database is empty (ready for migration)',
      };
    } else {
      const topTables = result.rows.map((r: any) => `${r.tablename} (${r.row_count})`).join(', ');
      return {
        name: 'Existing Data',
        status: 'warning',
        message: `Database contains ${totalRows} rows\n    Top tables: ${topTables}\n    ⚠️  Migration may cause conflicts or duplicates`,
      };
    }
  } catch (err) {
    return {
      name: 'Existing Data',
      status: 'warning',
      message: `Could not check existing data: ${err.message}`,
    };
  }
}

/**
 * Check Node.js and npm versions
 */
function checkNodeVersion(): CheckResult {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion >= 16) {
    return {
      name: 'Node.js Version',
      status: 'pass',
      message: `Node.js ${nodeVersion}`,
    };
  } else {
    return {
      name: 'Node.js Version',
      status: 'warning',
      message: `Node.js ${nodeVersion} (recommended >= 16)`,
    };
  }
}

/**
 * Print results in a formatted table
 */
function printResults(): void {
  console.log('\n📋 Pre-Migration Check Results');
  console.log('═'.repeat(80));

  let allPassed = true;
  let hasWarnings = false;

  for (const result of results) {
    const icon =
      result.status === 'pass'
        ? '✅'
        : result.status === 'fail'
        ? '❌'
        : '⚠️ ';

    console.log(`\n${icon} ${result.name}`);
    console.log(`  ${result.message}`);

    if (result.status === 'fail') allPassed = false;
    if (result.status === 'warning') hasWarnings = true;
  }

  console.log('\n' + '═'.repeat(80));

  if (!allPassed) {
    console.log('\n❌ MIGRATION NOT READY');
    console.log('   Please fix the failed checks above before proceeding.\n');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('\n⚠️  READY WITH WARNINGS');
    console.log('   Review the warnings above before proceeding.');
    console.log('   You can proceed with migration if you understand the risks.\n');
  } else {
    console.log('\n✅ ALL CHECKS PASSED');
    console.log('   System is ready for migration!\n');
    console.log('📝 Next steps:');
    console.log('   1. Create a database backup (recommended)');
    console.log('   2. Run migration: npm run migrate:legacy:simple');
    console.log('   3. Verify data after migration\n');
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('\n🔍 Running Pre-Migration Checks...\n');

  // Run all checks
  results.push(checkNodeVersion());
  results.push(checkLegacyFile());
  results.push(checkDiskSpace());
  results.push(await checkDatabaseConnection());
  results.push(await checkDatabaseSchema());
  results.push(await checkExistingData());

  // Print results
  printResults();
}

// Run if executed directly
if (require.main === module) {
  main().catch((err) => {
    console.error('\n❌ Check failed:', err.message);
    process.exit(1);
  });
}

export { main as preMigrationCheck };

