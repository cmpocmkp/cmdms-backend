import { createReadStream, createWriteStream, existsSync } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createInterface } from 'readline';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { Client } from 'pg';

/**
 * Legacy Data Migration Script

/**
 * Legacy Data Migration Script
 * 
 * This script migrates data from the legacy MySQL database dump
 * to the new PostgreSQL schema structure.
 * 
 * Usage: npm run migrate:legacy
 */

const LEGACY_SQL_FILE = join(__dirname, '../legacy-data/cmkpebooktm_2025-12-16_00-00-01.sql.gz');
const TEMP_SQL_FILE = join(__dirname, '../legacy-data/temp_uncompressed.sql');

// PostgreSQL connection
const dataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres:SSvMLVufcETbSHtUQSrkTvHbLtfbrdYj@metro.proxy.rlwy.net:29553/railway',
  synchronize: true,
  logging: true,
  entities: [join(__dirname, '../../src/**/*.entity.ts')],
});

interface MigrationStats {
  tablesProcessed: number;
  recordsInserted: number;
  errors: string[];
  tableStats: Record<string, { success: number; failed: number }>;
}

const stats: MigrationStats = {
  tablesProcessed: 0,
  recordsInserted: 0,
  errors: [],
  tableStats: {},
};

/**
 * Decompress the .sql.gz file
 */
async function decompressFile(): Promise<void> {
  console.log('📦 Decompressing SQL file...');
  
  if (!existsSync(LEGACY_SQL_FILE)) {
    throw new Error(`Legacy SQL file not found at: ${LEGACY_SQL_FILE}`);
  }

  const source = createReadStream(LEGACY_SQL_FILE);
  const destination = createWriteStream(TEMP_SQL_FILE);
  const gunzip = createGunzip();

  await pipeline(source, gunzip, destination);
  console.log('✅ Decompression complete');
}

/**
 * Convert MySQL syntax to PostgreSQL
 */
function convertMySQLToPostgreSQL(sql: string): string {
  let converted = sql;

  // Remove MySQL-specific comments and settings
  converted = converted.replace(/\/\*![0-9]+ .+? \*\/;?/g, '');
  converted = converted.replace(/-- MySQL dump.*/g, '');
  converted = converted.replace(/-- Server version.*/g, '');
  converted = converted.replace(/-- Host:.*/g, '');
  
  // Remove MySQL-specific table options
  converted = converted.replace(/ENGINE=\w+/gi, '');
  converted = converted.replace(/DEFAULT CHARSET=\w+/gi, '');
  converted = converted.replace(/COLLATE[= ]\w+/gi, '');
  converted = converted.replace(/AUTO_INCREMENT=\d+/gi, '');
  converted = converted.replace(/CHARACTER SET \w+/gi, '');

  // Convert data types
  converted = converted.replace(/bigint unsigned/gi, 'BIGINT');
  converted = converted.replace(/int unsigned/gi, 'INTEGER');
  converted = converted.replace(/tinyint\(1\)/gi, 'BOOLEAN');
  converted = converted.replace(/tinyint/gi, 'SMALLINT');
  converted = converted.replace(/datetime/gi, 'TIMESTAMP');
  converted = converted.replace(/longtext/gi, 'TEXT');
  converted = converted.replace(/mediumtext/gi, 'TEXT');
  
  // Convert backticks to double quotes for identifiers
  converted = converted.replace(/`([^`]+)`/g, '"$1"');

  // Remove LOCK TABLES and UNLOCK TABLES
  converted = converted.replace(/LOCK TABLES .+ WRITE;/gi, '');
  converted = converted.replace(/UNLOCK TABLES;/gi, '');

  // Remove ALTER TABLE DISABLE/ENABLE KEYS
  converted = converted.replace(/\/\*!40000 ALTER TABLE .+ DISABLE KEYS \*\/;/gi, '');
  converted = converted.replace(/\/\*!40000 ALTER TABLE .+ ENABLE KEYS \*\/;/gi, '');

  // Convert ON DELETE RESTRICT to ON DELETE NO ACTION (PostgreSQL default)
  converted = converted.replace(/ON DELETE RESTRICT/gi, 'ON DELETE NO ACTION');

  // Handle boolean values
  converted = converted.replace(/\\'/g, "''"); // Escape single quotes

  return converted;
}

/**
 * Parse and extract INSERT statements from SQL
 */
function parseInsertStatement(line: string): {
  table: string;
  values: string[];
} | null {
  const insertMatch = line.match(/INSERT INTO ["']?(\w+)["']?\s+(?:VALUES\s+)?(.+);?$/i);
  if (!insertMatch) return null;

  const table = insertMatch[1];
  const valuesStr = insertMatch[2];

  // Extract individual value sets from: (val1, val2), (val3, val4), ...
  const valuesSets: string[] = [];
  let depth = 0;
  let currentSet = '';
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];

    if (escapeNext) {
      currentSet += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      currentSet += char;
      continue;
    }

    if (char === "'" && !escapeNext) {
      inString = !inString;
      currentSet += char;
      continue;
    }

    if (!inString) {
      if (char === '(') {
        depth++;
        if (depth === 1) continue; // Skip the opening parenthesis
      } else if (char === ')') {
        depth--;
        if (depth === 0) {
          valuesSets.push(currentSet.trim());
          currentSet = '';
          continue;
        }
      }
    }

    if (depth > 0) {
      currentSet += char;
    }
  }

  return { table, values: valuesSets };
}

/**
 * Create missing tables that exist in legacy but not in new schema
 */
async function createMissingTables(): Promise<void> {
  console.log('🏗️  Creating missing tables...');

  try {
    // 1. Interventions
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS "interventions" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "attachments" JSONB,
        "created_by" INTEGER,
        "modified_by" INTEGER,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✅ Created table: interventions');

    // 2. Activities
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS "activities" (
        "id" SERIAL PRIMARY KEY,
        "intervention_id" INTEGER REFERENCES "interventions"("id") ON DELETE CASCADE,
        "title" VARCHAR(255) NOT NULL,
        "remarks" TEXT,
        "way_forward" TEXT,
        "timeline" DATE,
        "attachments" JSONB,
        "status" SMALLINT,
        "created_by" INTEGER,
        "modified_by" INTEGER,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('  ✅ Created table: activities');

    // 3. Activity Department
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS "activity_department" (
        "id" SERIAL PRIMARY KEY,
        "activity_id" INTEGER REFERENCES "activities"("id") ON DELETE CASCADE,
        "department_id" INTEGER REFERENCES "departments"("id") ON DELETE CASCADE,
        "status" SMALLINT,
        "due_date" DATE,
        "remarks" TEXT,
        "created_by" INTEGER,
        "modified_by" INTEGER,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        UNIQUE("activity_id", "department_id")
      )
    `);
    console.log('  ✅ Created table: activity_department');
  } catch (error) {
    console.error('  ❌ Failed to create missing tables:', error);
    throw error;
  }
}

/**
 * Process SQL file and migrate data
 */
async function processSQLFile(): Promise<void> {
  console.log('📖 Reading and processing SQL file...');

  const fileStream = createReadStream(TEMP_SQL_FILE);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentStatement = '';
  let currentTable = '';
  let batchInserts: Array<{ table: string; values: string }> = [];
  const BATCH_SIZE = 100;

  for await (const line of rl) {
    const trimmedLine = line.trim();

    // Skip comments and empty lines
    if (!trimmedLine || trimmedLine.startsWith('--') || trimmedLine.startsWith('/*')) {
      continue;
    }

    currentStatement += ' ' + trimmedLine;

    // Check if statement is complete (ends with semicolon)
    if (!trimmedLine.endsWith(';')) {
      continue;
    }

    // Process complete statement
    const statement = convertMySQLToPostgreSQL(currentStatement);
    currentStatement = '';

    try {
      // Handle CREATE TABLE
      if (statement.match(/CREATE TABLE/i)) {
        const tableMatch = statement.match(/CREATE TABLE\s+["']?(\w+)["']?/i);
        if (tableMatch) {
          currentTable = tableMatch[1];
          console.log(`📋 Processing table: ${currentTable}`);
          
          // Execute CREATE TABLE if not exists
          try {
            // Check if table exists first
            const tableExists = await dataSource.query(
              `SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = $1
              )`,
              [currentTable]
            );

            if (!tableExists[0].exists) {
              // Table doesn't exist in new schema - this is expected
              console.log(`  ℹ️  Table ${currentTable} not in new schema (will map data if applicable)`);
            }
          } catch (err) {
            console.warn(`  ⚠️  Could not check table ${currentTable}:`, err.message);
          }

          stats.tablesProcessed++;
          stats.tableStats[currentTable] = { success: 0, failed: 0 };
        }
      }

      // Handle INSERT statements
      else if (statement.match(/INSERT INTO/i)) {
        const insertData = parseInsertStatement(statement);
        if (insertData && insertData.values.length > 0) {
          // Add to batch
          for (const valueSet of insertData.values) {
            batchInserts.push({ table: insertData.table, values: valueSet });
          }

          // Execute batch if size reached
          if (batchInserts.length >= BATCH_SIZE) {
            await executeBatchInserts(batchInserts);
            batchInserts = [];
          }
        }
      }
    } catch (err) {
      stats.errors.push(`Error processing statement for table ${currentTable}: ${err.message}`);
      console.error(`  ❌ Error: ${err.message}`);
    }
  }

  // Execute remaining batch inserts
  if (batchInserts.length > 0) {
    await executeBatchInserts(batchInserts);
  }

  console.log('\n✅ SQL file processing complete');
}

/**
 * Table name mappings (legacy -> new schema)
 */
const TABLE_MAPPINGS: Record<string, string> = {
  // Core tables
  'provinces': 'provinces',
  'districts': 'districts',
  'departments': 'departments',
  'department_types': 'department_types',
  'roles': 'roles',
  'permissions': 'permissions',
  'user_groups': 'user_groups',
  'users': 'users',
  
  // Meetings
  'meeting_types': 'meeting_types',
  'meetings': 'meetings',
  'minutes': 'minutes',
  'replies': 'replies',
  'letters': 'letters',
  
  // Boards
  'board_details': 'boards',
  'board_meetings': 'board_meetings',
  'board_members': 'board_members',
  'board_acts': 'board_acts',
  'agenda_points': 'board_agenda_points',
  
  // Sectorial
  'sectorial_meetings': 'sectorial_meetings',
  'sectorial_agenda_points': 'sectorial_agenda_points',
  
  // Senate
  'senate_meetings': 'senate_meetings',
  'senate_minutes': 'senate_minutes',
  'senate_members': 'senate_members',
  
  // Directives & Announcements
  'directives': 'directives',
  'directive_replies': 'directive_responses',
  'announcements': 'announcements',
  'announcement_details': 'announcement_details',
  'announcement_replies': 'announcement_responses',
  
  // Complaints & Issues
  'complaints': 'complaints',
  'complaint_replies': 'complaint_responses',
  'issues': 'issues',
  
  // PTF
  'ptf_issues': 'ptf_issues',
  'ptf_meetings': 'ptf_meetings',
  'ptf_history': 'ptf_history',
  'cm_ptf_responses': 'ptf_responses',
  
  // Khushhal KPK
  'khushhal_kpks': 'khushhal_tasks',
  'khushhal_progress': 'khushhal_progress',
  'khushhal_replies': 'khushhal_replies',
  
  // CM Remarks
  'cm_remarks': 'cm_remarks',

  // Interventions & Activities
  'interventions': 'interventions',
  'activities': 'activities',
  'activity_department': 'activity_department',
  
  // Development Schemes
  'annual_schemes': 'annual_schemes',
  'costs': 'scheme_costings',
  'allocations': 'scheme_budgets',
  'expenditures': 'scheme_expenditures',
  'scheme_revisions': 'scheme_revisions',
  
  // Political
  'constituencies': 'constituencies',
  'candidates': 'candidates',
  
  // Performance
  'kpis': 'kpis',
  'kpi_data': 'kpi_data',
  'public_days': 'public_days',
  'welfare_initiatives': 'welfare_initiatives',
  'inaugurations': 'inaugurations',
  
  // Generic
  'tags': 'tags',
  'taggables': 'taggables',
  'activity_logs': 'activity_logs',
  'notifications': 'notifications',
  'files': 'files',
  
  // Tasks
  'tasks_tasks': 'tasks',
  'task_comments': 'task_comments',
  
  // Pivot tables
  'user_departments': 'user_departments',
  'permission_user': 'permission_user',
  'department_minute': 'department_minute',
  'department_directive': 'department_directive',
};

/**
 * Execute batch inserts
 */
async function executeBatchInserts(inserts: Array<{ table: string; values: string }>): Promise<void> {
  for (const insert of inserts) {
    const targetTable = TABLE_MAPPINGS[insert.table] || insert.table;
    
    // Check if target table exists
    try {
      const tableExists = await dataSource.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`,
        [targetTable]
      );

      if (!tableExists[0].exists) {
        // Skip tables that don't exist in new schema
        continue;
      }

      // Get column names for the table
      const columns = await dataSource.query(
        `SELECT column_name 
         FROM information_schema.columns 
         WHERE table_schema = 'public' 
         AND table_name = $1 
         ORDER BY ordinal_position`,
        [targetTable]
      );

      const columnNames = columns.map((col: any) => `"${col.column_name}"`).join(', ');
      
      // Build and execute INSERT statement
      const insertSQL = `INSERT INTO "${targetTable}" (${columnNames}) VALUES (${insert.values}) ON CONFLICT DO NOTHING`;
      
      await dataSource.query(insertSQL);
      
      stats.tableStats[insert.table].success++;
      stats.recordsInserted++;
      
      if (stats.recordsInserted % 100 === 0) {
        process.stdout.write(`\r  📝 Inserted ${stats.recordsInserted} records...`);
      }
    } catch (err) {
      stats.tableStats[insert.table].failed++;
      stats.errors.push(`Failed to insert into ${targetTable}: ${err.message}`);
    }
  }
}

/**
 * Print migration statistics
 */
function printStats(): void {
  console.log('\n\n📊 Migration Statistics:');
  console.log('═'.repeat(50));
  console.log(`✅ Tables processed: ${stats.tablesProcessed}`);
  console.log(`✅ Records inserted: ${stats.recordsInserted}`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  console.log('\n📋 Table-wise breakdown:');
  
  for (const [table, counts] of Object.entries(stats.tableStats)) {
    if (counts.success > 0 || counts.failed > 0) {
      console.log(`  ${table}: ${counts.success} ✅  ${counts.failed} ❌`);
    }
  }

  if (stats.errors.length > 0) {
    console.log('\n❌ Error Details (first 10):');
    stats.errors.slice(0, 10).forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
    
    if (stats.errors.length > 10) {
      console.log(`  ... and ${stats.errors.length - 10} more errors`);
    }
  }
}

/**
 * Main migration function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting Legacy Data Migration');
  console.log('═'.repeat(50));
  console.log(`Source: ${LEGACY_SQL_FILE}`);
  console.log(`Target: PostgreSQL (Railway)`);
  console.log('═'.repeat(50));
  console.log('');

  try {
    // Step -1: Drop conflicting tables
    console.log('🗑️  Dropping conflicting tables...');
    const client = new Client({
      connectionString: 'postgresql://postgres:SSvMLVufcETbSHtUQSrkTvHbLtfbrdYj@metro.proxy.rlwy.net:29553/railway',
    });
    await client.connect();
    await client.query('DROP TABLE IF EXISTS "department_types" CASCADE');
    await client.query('DROP TABLE IF EXISTS "districts" CASCADE');
    await client.query('DROP TABLE IF EXISTS "interventions" CASCADE');
    await client.query('DROP TABLE IF EXISTS "activities" CASCADE');
    await client.query('DROP TABLE IF EXISTS "activity_department" CASCADE');
    await client.end();
    console.log('✅ Dropped conflicting tables');

    // Initialize database connection
    console.log('🔌 Connecting to PostgreSQL...');
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    // Step 0: Create missing tables
    await createMissingTables();

    // Step 1: Decompress file
    await decompressFile();

    // Step 2: Process SQL file
    await processSQLFile();

    // Step 3: Update sequences
    console.log('\n🔄 Updating ID sequences...');
    const tables = Object.values(TABLE_MAPPINGS);
    for (const table of tables) {
      try {
        await dataSource.query(`
          SELECT setval(
            pg_get_serial_sequence('${table}', 'id'),
            COALESCE((SELECT MAX(id) FROM "${table}"), 1)
          )
        `);
      } catch (err) {
        // Ignore errors for tables without id column or that don't exist
      }
    }
    console.log('✅ Sequences updated\n');

    // Print statistics
    printStats();

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    // Cleanup
    await dataSource.destroy();
    
    // Optionally remove temp file
    // unlinkSync(TEMP_SQL_FILE);
  }
}

// Run migration
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main as migrateLegacyData };

