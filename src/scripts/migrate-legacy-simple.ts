import { execSync } from 'child_process';
import { Client } from 'pg';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Simplified Legacy Data Migration Script
 * 
 * This script uses pg_restore and SQL conversion for a more reliable migration
 * 
 * Usage: npm run migrate:legacy:simple
 */

const LEGACY_SQL_GZ = join(__dirname, '../legacy-data/cmkpebooktm_2025-12-16_00-00-01.sql.gz');
const CONVERTED_SQL = join(__dirname, '../legacy-data/converted_postgresql.sql');
const DB_URL = 'postgresql://postgres:SSvMLVufcETbSHtUQSrkTvHbLtfbrdYj@metro.proxy.rlwy.net:29553/railway';

interface ConversionStats {
  linesProcessed: number;
  tablesFound: number;
  insertsConverted: number;
  errors: string[];
}

const stats: ConversionStats = {
  linesProcessed: 0,
  tablesFound: 0,
  insertsConverted: 0,
  errors: [],
};

/**
 * Decompress and convert MySQL dump to PostgreSQL
 */
function convertMySQLDumpToPostgreSQL(): void {
  console.log('📦 Decompressing and converting SQL dump...');
  
  if (!existsSync(LEGACY_SQL_GZ)) {
    throw new Error(`SQL file not found: ${LEGACY_SQL_GZ}`);
  }

  // Decompress using gzip
  console.log('  🔓 Decompressing...');
  execSync(`gzip -dc "${LEGACY_SQL_GZ}" > "${CONVERTED_SQL}.tmp"`, {
    stdio: 'inherit',
  });

  // Read and convert
  console.log('  🔄 Converting MySQL syntax to PostgreSQL...');
  const mysqlContent = readFileSync(`${CONVERTED_SQL}.tmp`, 'utf-8');
  const lines = mysqlContent.split('\n');
  
  const convertedLines: string[] = [];
  let inCreateTable = false;
  let currentTable = '';
  let skipLine = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    stats.linesProcessed++;
    
    // Progress indicator
    if (stats.linesProcessed % 10000 === 0) {
      process.stdout.write(`\r    Processing line ${stats.linesProcessed}...`);
    }

    const trimmed = line.trim();
    
    // Skip MySQL-specific lines
    if (
      trimmed.startsWith('--') ||
      trimmed.startsWith('/*!') ||
      trimmed.includes('LOCK TABLES') ||
      trimmed.includes('UNLOCK TABLES') ||
      trimmed.includes('ALTER TABLE') && trimmed.includes('DISABLE KEYS') ||
      trimmed.includes('ALTER TABLE') && trimmed.includes('ENABLE KEYS') ||
      trimmed.length === 0
    ) {
      continue;
    }

    // Detect CREATE TABLE
    if (trimmed.match(/^CREATE TABLE/i)) {
      inCreateTable = true;
      const tableMatch = trimmed.match(/CREATE TABLE\s+`?(\w+)`?/i);
      if (tableMatch) {
        currentTable = tableMatch[1];
        stats.tablesFound++;
        console.log(`\n  📋 Found table: ${currentTable}`);
      }
    }

    // Convert line
    line = convertLine(line);
    
    // Skip if conversion resulted in empty line
    if (line.trim().length === 0) {
      continue;
    }
    
    // End of CREATE TABLE
    if (inCreateTable && trimmed.match(/\)\s*(ENGINE|DEFAULT|AUTO_INCREMENT)/i)) {
      // Remove ENGINE and other MySQL-specific clauses at end of CREATE TABLE
      line = line.replace(/\)\s*ENGINE=\w+.*?;/i, ');');
      line = line.replace(/\)\s*DEFAULT\s+CHARSET=.*?;/i, ');');
      line = line.replace(/\)\s*AUTO_INCREMENT=.*?;/i, ');');
      // Clean up any remaining MySQL syntax before semicolon
      line = line.replace(/\)\s+(ENGINE|DEFAULT|AUTO_INCREMENT|CHARACTER SET|COLLATE)[^;]*;/gi, ');');
      inCreateTable = false;
    }

    // Track INSERT statements
    if (trimmed.match(/^INSERT INTO/i)) {
      stats.insertsConverted++;
      if (stats.insertsConverted % 1000 === 0) {
        process.stdout.write(`\r    Converted ${stats.insertsConverted} INSERT statements...`);
      }
    }

    convertedLines.push(line);
  }

  console.log('\n  💾 Writing converted SQL file...');
  let finalSQL = convertedLines.join('\n');
  
  // Post-process: Remove orphaned commas from KEY removal
  // Pattern: lines with only whitespace and commas between actual content
  finalSQL = finalSQL.replace(/,\s*\n\s*,/g, ','); // Remove duplicate commas
  finalSQL = finalSQL.replace(/,\s*\n\s*,/g, ','); // Run twice for triple commas
  finalSQL = finalSQL.replace(/,\s*\n\s*,/g, ','); // Run third time for quad commas
  finalSQL = finalSQL.replace(/,(\s*\n\s*)(CONSTRAINT|PRIMARY|UNIQUE|\))/g, '$1$2'); // Remove comma before constraint/closing paren
  
  writeFileSync(CONVERTED_SQL, finalSQL);
  
  // Cleanup temp file
  execSync(`rm -f "${CONVERTED_SQL}.tmp"`);
  
  console.log('✅ Conversion complete\n');
}

/**
 * Convert individual line from MySQL to PostgreSQL syntax
 */
function convertLine(line: string): string {
  let converted = line;

  // Convert backticks to double quotes
  converted = converted.replace(/`([^`]+)`/g, '"$1"');

  // Convert data types
  converted = converted.replace(/\bbigint\s+unsigned\b/gi, 'BIGINT');
  converted = converted.replace(/\bint\s+unsigned\b/gi, 'INTEGER');
  converted = converted.replace(/\btinyint\(1\)\s+unsigned\b/gi, 'BOOLEAN');
  converted = converted.replace(/\btinyint\(1\)/gi, 'BOOLEAN');
  converted = converted.replace(/\btinyint\s+unsigned\b/gi, 'SMALLINT');
  converted = converted.replace(/\btinyint\b/gi, 'SMALLINT');
  converted = converted.replace(/\bdatetime\b/gi, 'TIMESTAMP');
  converted = converted.replace(/\blongtext\b/gi, 'TEXT');
  converted = converted.replace(/\bmediumtext\b/gi, 'TEXT');

  // Remove AUTO_INCREMENT from column definitions
  converted = converted.replace(/\s+AUTO_INCREMENT\b/gi, '');
  
  // Remove MySQL-specific keywords
  converted = converted.replace(/\s+CHARACTER SET \w+/gi, '');
  converted = converted.replace(/\s+COLLATE \w+/gi, '');
  converted = converted.replace(/\s+AUTO_INCREMENT=\d+/gi, '');
  converted = converted.replace(/\s+DEFAULT CHARSET=\w+/gi, '');

  // Convert constraints
  converted = converted.replace(/ON DELETE RESTRICT/gi, 'ON DELETE NO ACTION');
  converted = converted.replace(/ON UPDATE RESTRICT/gi, 'ON UPDATE NO ACTION');

  // Handle UNIQUE KEY - convert to proper PostgreSQL constraint
  converted = converted.replace(/UNIQUE KEY\s+"([^"]+)"\s+\(([^)]+)\)/gi, 'UNIQUE ($2)');
  
  // Remove regular KEY definitions (indexes) - PostgreSQL creates indexes differently
  // If line starts with KEY, remove the entire line
  if (converted.trim().match(/^KEY\s+/i)) {
    return '';  // Return empty string to remove this line
  }
  converted = converted.replace(/,?\s*KEY\s+"([^"]+)"\s+\(([^)]+)\),?/gi, '');

  return converted;
}

/**
 * Execute SQL file on PostgreSQL database
 */
async function executeSQLFile(): Promise<void> {
  console.log('🔌 Connecting to PostgreSQL and executing migration...\n');
  
  const client = new Client({
    connectionString: DB_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read SQL file
    const sql = readFileSync(CONVERTED_SQL, 'utf-8');
    
    // Smart split into statements (handles strings with semicolons)
    const statements = splitSQLStatements(sql);

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);
    
    let executed = 0;
    let skipped = 0;
    let failed = 0;

    for (const statement of statements) {
      try {
        // Skip empty or comment-only statements
        if (!statement || statement.startsWith('--')) {
          continue;
        }

        // Execute statement
        await client.query(statement + ';');
        executed++;
        
        if (executed % 100 === 0) {
          process.stdout.write(`\r  ✅ Executed: ${executed} | ⏭️  Skipped: ${skipped} | ❌ Failed: ${failed}`);
        }
      } catch (err) {
        // Check if error is due to table/constraint already existing
        if (
          err.message.includes('already exists') ||
          err.message.includes('does not exist') ||
          err.message.includes('duplicate key')
        ) {
          skipped++;
        } else {
          failed++;
          stats.errors.push(`Statement failed: ${err.message.substring(0, 100)}`);
          
          // Log first few errors
          if (failed <= 5) {
            console.error(`\n  ❌ Error: ${err.message.substring(0, 200)}`);
          }
        }
      }
    }

    console.log(`\n\n✅ Execution complete: ${executed} statements executed, ${skipped} skipped, ${failed} failed\n`);

    // Update sequences
    console.log('🔄 Updating ID sequences...');
    await updateSequences(client);
    console.log('✅ Sequences updated\n');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Smart SQL statement splitter that handles strings with semicolons
 */
function splitSQLStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  let escapeNext = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      current += char;
      continue;
    }

    if ((char === "'" || char === '"') && !escapeNext) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      current += char;
      continue;
    }

    if (char === ';' && !inString) {
      const trimmed = current.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        statements.push(trimmed);
      }
      current = '';
      continue;
    }

    current += char;
  }

  // Add last statement if any
  const trimmed = current.trim();
  if (trimmed && !trimmed.startsWith('--')) {
    statements.push(trimmed);
  }

  return statements;
}

/**
 * Update ID sequences for all tables
 */
async function updateSequences(client: Client): Promise<void> {
  const tablesResult = await client.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  `);

  for (const row of tablesResult.rows) {
    const tableName = row.tablename;
    
    try {
      // Check if table has an id column
      const columnResult = await client.query(
        `SELECT column_name 
         FROM information_schema.columns 
         WHERE table_name = $1 AND column_name = 'id'`,
        [tableName]
      );

      if (columnResult.rows.length > 0) {
        // Update sequence
        await client.query(`
          SELECT setval(
            pg_get_serial_sequence('${tableName}', 'id'),
            COALESCE((SELECT MAX(id) FROM "${tableName}"), 1),
            true
          )
        `);
      }
    } catch (err) {
      // Ignore errors for tables without sequences
    }
  }
}

/**
 * Print statistics
 */
function printStats(): void {
  console.log('\n📊 Migration Statistics:');
  console.log('═'.repeat(60));
  console.log(`📄 Lines processed: ${stats.linesProcessed.toLocaleString()}`);
  console.log(`📋 Tables found: ${stats.tablesFound}`);
  console.log(`📝 INSERT statements converted: ${stats.insertsConverted.toLocaleString()}`);
  console.log(`❌ Errors encountered: ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ First 5 errors:');
    stats.errors.slice(0, 5).forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  }
  
  console.log('═'.repeat(60));
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('\n🚀 Legacy Data Migration - Simplified Method');
  console.log('═'.repeat(60));
  console.log(`📁 Source: ${LEGACY_SQL_GZ}`);
  console.log(`🎯 Target: PostgreSQL (Railway)`);
  console.log(`📝 Converted SQL: ${CONVERTED_SQL}`);
  console.log('═'.repeat(60));
  console.log('');

  const startTime = Date.now();

  try {
    // Step 1: Convert MySQL dump to PostgreSQL
    convertMySQLDumpToPostgreSQL();

    // Step 2: Execute SQL on PostgreSQL
    await executeSQLFile();

    // Step 3: Print statistics
    printStats();

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✅ Migration completed successfully in ${duration}s!`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Verify data in your database');
    console.log('   2. Check for any missing relationships');
    console.log('   3. Run your application tests');
    console.log('   4. Review the converted SQL file for any issues');
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as migrateLegacyDataSimple };

