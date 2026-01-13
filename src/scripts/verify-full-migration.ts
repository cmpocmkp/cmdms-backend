
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load Env
dotenv.config();

// Define Entities (We use raw SQL or metadata if possible, but importing helps)
// To keep it simple and robust, we will look up tables by string name or map them explicitly.
const FILE_TABLE_MAP: Record<string, string> = {
    'users.json': 'users',
    'departments.json': 'departments',
    'department_types.json': 'department_types',
    'districts.json': 'districts',
    'user_groups.json': 'user_groups',
    'activity_logs.json': 'activity_logs',
    'roles.json': 'roles',
    'permissions.json': 'permissions',
    'permission_user.json': 'permission_user',

    // Boards
    'board_details.json': 'boards',
    'board_members.json': 'board_members',
    'board_meetings.json': 'board_meetings',
    'board_acts.json': 'board_acts',
    'agenda_points.json': 'board_agendas',
    // 'board_replies.json': '?' // Likely board_meeting_replies or similar? Need to check.

    // Complaints
    'complaints.json': 'complaints',
    'complaint_replies.json': 'complaint_responses',

    // Announcements
    'announcements.json': 'announcements',
    'announcement_details.json': 'announcement_details',
    'annonucement_replies.json': 'announcement_responses',

    // Directives
    'directives.json': 'directives',
    'directive_replies.json': 'directive_responses',
    'department_directive.json': 'department_directive', // Pivot table?

    // Minutes
    'minutes.json': 'minutes',
    'department_minute.json': 'department_minute',

    // Issues
    'issues.json': 'issues',

    // PTF
    'cm_ptf_responses.json': 'ptf_responses',

    // Schemes
    'annual_schemes.json': 'annual_schemes',

    // KPI
    'kpi.json': 'kpis',
    'kpi_data.json': 'kpi_data',

    // Khushhal
    'khushhal_kpks.json': 'khushhal_tasks',
    'khushhal_progress.json': 'khushhal_progress',
    'khushhal_replies.json': 'khushhal_replies',

    // Inaugurations
    'inaugurations.json': 'inaugurations',

    // Files
    'images.json': 'files',
    'constituencies.json': 'constituencies',
    'candidates.json': 'candidates',
    'department_type.json': 'department_types',
    'constituency.json': 'constituencies',

    // Others that might be pivot tables or ignored
    'department_sector_agenda_point.json': 'board_agenda_department',
    'sectorial_agenda_points.json': 'board_agendas',
    'meetings.json': 'meetings',
    'tasks_tasks.json': 'tasks',
    // 'department_user.json': 'department_user', 
};

const DATA_DIR = path.join(__dirname, '../../old_data');

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'cmdms',
    synchronize: false,
    logging: false,
});

async function verify() {
    await AppDataSource.initialize();
    console.log(`[DEBUG] Verification DB Host: ${process.env.DATABASE_HOST}`);
    console.log(`[DEBUG] Verification DB Name: ${process.env.DATABASE_NAME}`);
    console.log('Database connected.');
    console.log('----------------------------------------------------------------');
    console.log(`| ${'File Name'.padEnd(35)} | ${'JSON Records'.padEnd(12)} | ${'DB Records'.padEnd(10)} | ${'Status'.padEnd(10)} |`);
    console.log('----------------------------------------------------------------');

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
        if (file === 'failed_jobs.json') continue; // Skip strictly irrelevant

        const filePath = path.join(DATA_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        let jsonCount = 0;
        try {
            const json = JSON.parse(content);
            const tableData = Array.isArray(json) ? json.find((item: any) => item.type === 'table') : null;
            if (tableData && tableData.data) {
                jsonCount = tableData.data.length;
            }
        } catch (e) {
            console.log(`| ${file.padEnd(35)} | ${'ERROR'.padEnd(12)} | ${'-'.padEnd(10)} | Invalid JSON |`);
            continue;
        }

        const tableName = FILE_TABLE_MAP[file];
        let dbCount = 0;
        let status = 'UNKNOWN';
        let note = '';

        if (tableName) {
            try {
                // Check if table exists first?
                // Or just try count
                const result = await AppDataSource.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
                dbCount = parseInt(result[0].count);

                if (dbCount >= jsonCount) {
                    status = 'OK';
                } else if (dbCount === 0) {
                    status = 'MISSING';
                } else {
                    status = 'PARTIAL';
                }
            } catch (e) {
                status = 'DB ERROR'; // Table might not exist
                note = e.message.includes('does not exist') ? '(Table not found)' : '';
            }
        } else {
            status = 'NO MAPPING';
        }

        const statusColor = status === 'OK' ? '\x1b[32mOK\x1b[0m' : status === 'MISSING' || status === 'PARTIAL' ? '\x1b[31m' + status + '\x1b[0m' : status;

        console.log(`| ${file.padEnd(35)} | ${jsonCount.toString().padEnd(12)} | ${dbCount.toString().padEnd(10)} | ${status.padEnd(10)} | ${note}`);
    }
    console.log('----------------------------------------------------------------');

    await AppDataSource.destroy();
}

verify().catch(console.error);
