import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createReadStream, createWriteStream, existsSync, unlinkSync } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createInterface } from 'readline';
import { join } from 'path';

export interface MigrationStats {
  tablesProcessed: number;
  recordsInserted: number;
  errors: string[];
  tableStats: Record<string, { success: number; failed: number }>;
}

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);
  private stats: MigrationStats = {
    tablesProcessed: 0,
    recordsInserted: 0,
    errors: [],
    tableStats: {},
  };

  private TABLE_MAPPINGS: Record<string, string> = {
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

  constructor(private dataSource: DataSource) {}

  async runLegacyMigration() {
    this.logger.log('Starting Legacy Data Migration via Endpoint');
    
    // Adjust path for built application or source
    // In dev: src/modules/migration/migration.service.ts -> src/legacy-data
    // In prod: dist/modules/migration/migration.service.js -> dist/legacy-data (via assets)
    const LEGACY_SQL_FILE = join(__dirname, '../../legacy-data/cmkpebooktm_2025-12-16_00-00-01.sql.gz');
    const TEMP_SQL_FILE = join(__dirname, '../../legacy-data/temp_uncompressed.sql');

    try {
      if (!existsSync(LEGACY_SQL_FILE)) {
        throw new Error(`Legacy SQL file not found at: ${LEGACY_SQL_FILE}`);
      }

      // Drop conflicting tables
      await this.dropConflictingTables();

      // Create missing tables
      await this.createMissingTables();

      // Decompress
      await this.decompressFile(LEGACY_SQL_FILE, TEMP_SQL_FILE);

      // Process
      await this.processSQLFile(TEMP_SQL_FILE);

      // Update sequences
      await this.updateSequences();

      // Cleanup
      if (existsSync(TEMP_SQL_FILE)) {
        unlinkSync(TEMP_SQL_FILE);
      }

      return {
        message: 'Migration completed successfully',
        stats: this.stats,
      };

    } catch (error) {
      this.logger.error('Migration failed', error);
      throw error;
    }
  }

  private async dropConflictingTables() {
    this.logger.log('Dropping conflicting tables...');
    const tables = ['department_types', 'districts', 'interventions', 'activities', 'activity_department'];
    
    for (const table of tables) {
      await this.dataSource.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }
  }

  private async createMissingTables() {
    this.logger.log('Creating missing tables...');

    // 1. Interventions
    await this.dataSource.query(`
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

    // 2. Activities
    await this.dataSource.query(`
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

    // 3. Activity Department
    await this.dataSource.query(`
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
  }

  private async decompressFile(sourcePath: string, destPath: string) {
    this.logger.log('Decompressing SQL file...');
    const source = createReadStream(sourcePath);
    const destination = createWriteStream(destPath);
    const gunzip = createGunzip();
    await pipeline(source, gunzip, destination);
  }

  private async processSQLFile(filePath: string) {
    this.logger.log('Processing SQL file...');
    const fileStream = createReadStream(filePath);
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

      if (!trimmedLine || trimmedLine.startsWith('--') || trimmedLine.startsWith('/*')) {
        continue;
      }

      currentStatement += ' ' + trimmedLine;

      if (!trimmedLine.endsWith(';')) {
        continue;
      }

      const statement = this.convertMySQLToPostgreSQL(currentStatement);
      currentStatement = '';

      try {
        if (statement.match(/CREATE TABLE/i)) {
          const tableMatch = statement.match(/CREATE TABLE\s+["']?(\w+)["']?/i);
          if (tableMatch) {
            currentTable = tableMatch[1];
            
            // Just init stats for table
            this.stats.tablesProcessed++;
            this.stats.tableStats[currentTable] = { success: 0, failed: 0 };
          }
        } else if (statement.match(/INSERT INTO/i)) {
          const insertData = this.parseInsertStatement(statement);
          if (insertData && insertData.values.length > 0) {
            for (const valueSet of insertData.values) {
              batchInserts.push({ table: insertData.table, values: valueSet });
            }

            if (batchInserts.length >= BATCH_SIZE) {
              await this.executeBatchInserts(batchInserts);
              batchInserts = [];
            }
          }
        }
      } catch (err) {
        this.stats.errors.push(`Error processing statement for table ${currentTable}: ${err.message}`);
      }
    }

    if (batchInserts.length > 0) {
      await this.executeBatchInserts(batchInserts);
    }
  }

  private async executeBatchInserts(inserts: Array<{ table: string; values: string }>) {
    for (const insert of inserts) {
      const targetTable = this.TABLE_MAPPINGS[insert.table] || insert.table;
      
      try {
        // Simple check if table exists in stats or blindly try insert
        // Assuming table exists because we synced schema or created it
        
        // Use raw query to get column names dynamically to build insert
        // This might be slow if done for every batch, but safe
        // Optimally we cache column names
        
        const columns = await this.dataSource.query(
          `SELECT column_name 
           FROM information_schema.columns 
           WHERE table_schema = 'public' 
           AND table_name = $1 
           ORDER BY ordinal_position`,
          [targetTable]
        );

        if (columns.length === 0) continue; // Table doesn't exist

        const columnNames = columns.map((col: any) => `"${col.column_name}"`).join(', ');
        const insertSQL = `INSERT INTO "${targetTable}" (${columnNames}) VALUES (${insert.values}) ON CONFLICT DO NOTHING`;
        
        await this.dataSource.query(insertSQL);
        
        if (!this.stats.tableStats[insert.table]) {
            this.stats.tableStats[insert.table] = { success: 0, failed: 0 };
        }
        this.stats.tableStats[insert.table].success++;
        this.stats.recordsInserted++;
      } catch (err) {
        if (!this.stats.tableStats[insert.table]) {
            this.stats.tableStats[insert.table] = { success: 0, failed: 0 };
        }
        this.stats.tableStats[insert.table].failed++;
        this.stats.errors.push(`Failed to insert into ${targetTable}: ${err.message}`);
      }
    }
  }

  private convertMySQLToPostgreSQL(sql: string): string {
    let converted = sql;
    converted = converted.replace(/\/\*![0-9]+ .+? \*\/;?/g, '');
    converted = converted.replace(/-- MySQL dump.*/g, '');
    converted = converted.replace(/-- Server version.*/g, '');
    converted = converted.replace(/-- Host:.*/g, '');
    converted = converted.replace(/ENGINE=\w+/gi, '');
    converted = converted.replace(/DEFAULT CHARSET=\w+/gi, '');
    converted = converted.replace(/COLLATE[= ]\w+/gi, '');
    converted = converted.replace(/AUTO_INCREMENT=\d+/gi, '');
    converted = converted.replace(/CHARACTER SET \w+/gi, '');
    converted = converted.replace(/bigint unsigned/gi, 'BIGINT');
    converted = converted.replace(/int unsigned/gi, 'INTEGER');
    converted = converted.replace(/tinyint\(1\)/gi, 'BOOLEAN');
    converted = converted.replace(/tinyint/gi, 'SMALLINT');
    converted = converted.replace(/datetime/gi, 'TIMESTAMP');
    converted = converted.replace(/longtext/gi, 'TEXT');
    converted = converted.replace(/mediumtext/gi, 'TEXT');
    converted = converted.replace(/`([^`]+)`/g, '"$1"');
    converted = converted.replace(/LOCK TABLES .+ WRITE;/gi, '');
    converted = converted.replace(/UNLOCK TABLES;/gi, '');
    converted = converted.replace(/\/\*!40000 ALTER TABLE .+ DISABLE KEYS \*\/;/gi, '');
    converted = converted.replace(/\/\*!40000 ALTER TABLE .+ ENABLE KEYS \*\/;/gi, '');
    converted = converted.replace(/ON DELETE RESTRICT/gi, 'ON DELETE NO ACTION');
    converted = converted.replace(/\\'/g, "''");
    return converted;
  }

  private parseInsertStatement(line: string): { table: string; values: string[] } | null {
    const insertMatch = line.match(/INSERT INTO ["']?(\w+)["']?\s+(?:VALUES\s+)?(.+);?$/i);
    if (!insertMatch) return null;

    const table = insertMatch[1];
    const valuesStr = insertMatch[2];
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
          if (depth === 1) continue;
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

  private async updateSequences() {
    this.logger.log('Updating ID sequences...');
    const tables = Object.values(this.TABLE_MAPPINGS);
    for (const table of tables) {
      try {
        await this.dataSource.query(`
          SELECT setval(
            pg_get_serial_sequence('${table}', 'id'),
            COALESCE((SELECT MAX(id) FROM "${table}"), 1)
          )
        `);
      } catch (err) {
        // Ignore
      }
    }
  }
}

