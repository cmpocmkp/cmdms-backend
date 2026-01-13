// @ts-nocheck
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Import All Entities (Using wildcard if possible, but manual import is safer for script)
// Common
import { User } from '../modules/users/entities/user.entity';
import { Department } from '../modules/departments/entities/department.entity';
import { DepartmentType } from '../modules/departments/entities/department-type.entity';
import { District } from '../modules/departments/entities/district.entity';
import { Province } from '../modules/departments/entities/province.entity';
import { UserGroup } from '../modules/users/entities/user-group.entity';

// Complaints
import { Complaint } from '../modules/complaints/entities/complaint.entity';
import { ComplaintResponse } from '../modules/complaints/entities/complaint-response.entity';

// Announcements
import { Announcement } from '../modules/announcements/entities/announcement.entity';
import { AnnouncementDetail } from '../modules/announcements/entities/announcement-detail.entity';
import { AnnouncementResponse } from '../modules/announcements/entities/announcement-response.entity';

// Boards
import { Board } from '../modules/boards/entities/board.entity';
import { BoardMember } from '../modules/boards/entities/board-member.entity';
import { BoardMeeting } from '../modules/boards/entities/board-meeting.entity';
import { BoardAct } from '../modules/boards/entities/board-act.entity';
import { BoardAgenda } from '../modules/boards/entities/board-agenda.entity';

// Others
import { ActivityLog } from '../modules/activity-logs/entities/activity-log.entity';
// Roles & Permissions
import { Role } from '../modules/roles/entities/role.entity';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { PermissionUser } from '../modules/permissions/entities/permission-user.entity';

// Directives
import { Directive } from '../modules/directives/entities/directive.entity';
import { DirectiveResponse } from '../modules/directives/entities/directive-response.entity';

// Issues
import { Issue } from '../modules/issues/entities/issue.entity';
import { IssueHistory } from '../modules/issues/entities/issue-history.entity';

// Meetings
import { Meeting } from '../modules/meetings/entities/meeting.entity';
import { MeetingType } from '../modules/meetings/entities/meeting-type.entity';

// Minutes
import { Minute } from '../modules/minutes/entities/minute.entity';
import { Reply } from '../modules/minutes/entities/reply.entity';

// PTF
import { PtfResponse } from '../modules/ptf/entities/ptf-response.entity';
import { PtfMeeting } from '../modules/ptf/entities/ptf-meeting.entity';
import { PtfIssue } from '../modules/ptf/entities/ptf-issue.entity';

// Schemes
import { AnnualScheme } from '../modules/schemes/entities/annual-scheme.entity';

// Candidates
import { Candidate } from '../modules/candidates/entities/candidate.entity';
import { Constituency } from '../modules/candidates/entities/constituency.entity';

// KPI
import { Kpi } from '../modules/kpi/entities/kpi.entity';
import { KpiData } from '../modules/kpi/entities/kpi-data.entity';

// Khushhal
import { KhushhalProgress } from '../modules/khushhal-kpk/entities/khushhal-progress.entity';
import { KhushhalReply } from '../modules/khushhal-kpk/entities/khushhal-reply.entity';
import { KhushhalTask } from '../modules/khushhal-kpk/entities/khushhal-task.entity';

// Public Days
import { PublicDay } from '../modules/public-days/entities/public-day.entity';

// Files
import { File } from '../modules/files/entities/file.entity';

// Inaugurations
import { Inauguration } from '../modules/inaugurations/entities/inauguration.entity';

// PTF Meetings
import { PtfMeeting } from '../modules/ptf/entities/ptf-meeting.entity';

// Tasks
import { Task } from '../modules/tasks/entities/task.entity';
// Add more as needed based on file list... that's too many imports to guess.
// I'll rely on string-to-entity map if I can dynamically load, but TS-node makes that hard.
// I will import what I found in the file list.

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'cmdms',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
});

console.log(`[DEBUG] Connecting to Database Host: ${process.env.DATABASE_HOST || 'FALLBACK-LOCALHOST'}`);
console.log(`[DEBUG] Database Name: ${process.env.DATABASE_NAME}`);

const DATA_DIR = path.join(__dirname, '../../old_data');

async function readJsonFile(filename: string): Promise<any[]> {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    const tableData = json.find((item: any) => item.type === 'table');
    return tableData ? tableData.data : [];
}

// Helper to convert snake_case to camelCase
const toCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

interface MigrationConfig {
    file: string;
    entityName: string; // String name to look up metadata
    customTransform?: (item: any) => any;
    skip?: boolean;
    postProcess?: (item: any, entity: any) => void;
}

const deptMap = new Map<number, string>();
const deptBoardMap = new Map<number, number>(); // Dept ID -> Board ID
const userEmailMap = new Set<string>(); // Check uniqueness
const userIds = new Set<number>(); // Check existence for FKs
const districtIds = new Set<number>();

// Import Enums
import { BoardMemberType, BoardMemberStatus, DecisionStatus } from '../common/enums';

const agendaDeptMap = new Map<number, number[]>(); // Agenda ID -> Dept IDs
const meetingDeptMap = new Map<number, number>(); // Meeting ID -> Dept ID

const loadAgendaDeptMap = async () => {
    try {
        const raw = await readJsonFile('department_sector_agenda_point.json');
        raw.forEach((item: any) => {
            const agendaId = parseInt(item.sectorial_agenda_point_id || '0');
            const deptId = parseInt(item.department_id || '0');
            if (agendaId && deptId) {
                if (!agendaDeptMap.has(agendaId)) {
                    agendaDeptMap.set(agendaId, []);
                }
                agendaDeptMap.get(agendaId)?.push(deptId);
            }
        });
        console.log(`Loaded ${agendaDeptMap.size} agenda-department mappings.`);

        // Also load meetings for validation
        const meetings = await readJsonFile('board_meetings.json');
        meetings.forEach((m: any) => {
            const mid = parseInt(m.id);
            const did = parseInt(m.department_id);
            if (mid && did) meetingDeptMap.set(mid, did);
        });
        console.log(`Loaded ${meetingDeptMap.size} meeting-department mappings.`);

    } catch (error) {
        console.warn('Could not load agenda-dept map:', error.message);
    }
};

const MIGRATION_MAP: MigrationConfig[] = [
    // 1. Lookups
    { file: 'department_types.json', entity: DepartmentType, skip: true, transform: (i) => ({ ...i, name: i.type || i.name }) },
    { file: 'districts.json', entity: District, skip: true, transform: (i) => ({ ...i, provinceId: 1 }) },

    // Roles & Permissions (Must be before Users)
    {
        file: 'roles.json', entity: Role, skip: true, transform: (i) => ({
            ...i,
            name: i.role_name,
            description: i.description || '',
            isActive: i.is_active === '1'
        })
    },
    {
        file: 'permissions.json',
        entity: Permission,
        skip: true, // Skip permissions migration as data already exists
        transform: (i) => {
            // Derive Module from Controller
            let moduleName = 'System';
            if (i.controller && i.controller.includes('\\')) {
                const parts = i.controller.split('\\');
                const controllerName = parts[parts.length - 1]; // e.g. UserController
                moduleName = controllerName.replace('Controller', '');
            } else if (i.name) {
                moduleName = i.name.split('.')[0];
            }

            // Derive Display Name
            let displayName = i.name || `${moduleName} ${i.method}`;
            // Format name: admin.users.list -> Admin Users List
            displayName = displayName.replace(/\./g, ' ').replace(/-/g, ' ');
            displayName = displayName.replace(/\b\w/g, l => l.toUpperCase());

            // Unique Name
            const name = i.name || `${moduleName}.${i.method}`.toLowerCase();

            return {
                id: parseInt(i.id),
                name: name,
                displayName: displayName,
                module: moduleName,
                category: name.split('.')[0] || 'General',
                description: i.description || null,
            };
        }
    },

    // 2. Core
    { file: 'user_groups.json', entity: UserGroup, skip: true },
    { file: 'departments.json', entity: Department, skip: true },
    {
        file: 'users.json', entity: User, skip: true, transform: (i) => {
            let email = i.email || `user${i.id}@example.com`;
            if (userEmailMap.has(email)) {
                email = `dup${i.id}_${email}`;
            }
            userEmailMap.add(email);

            return {
                ...i,
                isActive: i.is_active === '1',
                mustChangePassword: i.must_change_password === '1',
                // Default name/email if missing to prevent constraints
                name: i.name || 'Unknown User',
                email: email,
                departmentId: i.department_id ? parseInt(i.department_id) : null,
                roleId: i.role_id ? parseInt(i.role_id) : null,
                // Map numeric types to UserType Enum
                type: i.type === '1' ? 'system' : 'regular',
                created_at: i.created_at ? new Date(i.created_at) : new Date(),
            };
        }
    },

    // 3. Complaints
    {
        file: 'complaints.json', entity: Complaint, skip: true, transform: (i) => ({
            ...i,
            status: i.status === '1' ? 'resolved' :
                i.status === '2' ? 'in_progress' :
                    i.status === '3' ? 'closed' : 'new',
            priority: 'normal',
            isArchived: false,
            timeline: i.timeline ? new Date(i.timeline) : new Date(),
            title: i.title || 'No Title',
            detail: i.detail || 'No Details Provided',
            created_at: i.created_at ? new Date(i.created_at) : new Date(),
        })
    },
    { file: 'complaint_replies.json', entity: ComplaintResponse, skip: true, transform: (i) => ({ ...i, complaintId: i.complaint_id, response: i.response || 'No Response Content' }) },

    // 4. Announcements
    {
        file: 'announcements.json', entity: Announcement, skip: true, transform: (i) => ({
            ...i,
            attachments: i.attachment ? [i.attachment] : [],
            type: 'public',
            priority: 'normal',
            title: i.title || 'Untitled Announcement',
            description: i.description || 'No Description',
        })
    },
    { file: 'announcement_details.json', entity: AnnouncementDetail, skip: true, transform: (i) => ({ ...i, description: i.description || 'No Detail Content' }) },
    { file: 'annonucement_replies.json', entity: AnnouncementResponse, skip: true, transform: (i) => ({ ...i, response: i.response || 'No Content' }) },

    // 5. Boards
    {
        file: 'board_details.json', entity: Board, skip: true, transform: (i) => ({
            ...i,
            name: deptMap.get(parseInt(i.department_id)) ? `${deptMap.get(parseInt(i.department_id))} Board` : `Board ${i.id}`,
            boardType: 'advisory',
            meetingFrequency: i.meeting_frequency === '1' ? 'monthly' :
                i.meeting_frequency === '2' ? 'quarterly' :
                    i.meeting_frequency === '3' ? 'bi-annually' :
                        i.meeting_frequency === '4' ? 'annually' : 'monthly',
            parentDepartmentId: i.department_id ? parseInt(i.department_id) : null
        }),
        postProcess: (item, entity) => {
            if (entity.parentDepartmentId) {
                deptBoardMap.set(entity.parentDepartmentId, entity.id);
            }
        }
    },
    {
        file: 'board_members.json', entity: BoardMember, skip: true, transform: (i) => {
            const deptId = parseInt(i.department_id);
            const boardId = deptBoardMap.get(deptId);
            return {
                ...i,
                type: i.type === '1' ? BoardMemberType.EX_OFFICIO : BoardMemberType.MEMBER,
                status: i.status === '1' ? BoardMemberStatus.ACTIVE : BoardMemberStatus.TERM_EXPIRED,
                boardId: boardId // Map Dept -> Board
            };
        }
    },
    {
        file: 'board_meetings.json', entity: BoardMeeting, skip: true, transform: (i) => {
            const deptId = parseInt(i.department_id);
            // Fallback: If no board for dept, use a default or first board, or try to find by dept
            // But we have deptBoardMap
            let boardId = deptBoardMap.get(deptId);
            if (!boardId) {
                // If map failed, maybe deptId is the boardId (unlikely) or data inconsistency.
                // Log and maybe skip or assign to dummy?
                // Let's try to find ANY board, or create a dummy board one-time?
                // For now, let's map to existing boards loop or just log.
                console.warn(`No board found for department ${deptId} in meeting ${i.id}`);
                return null;
            }
            return {
                ...i,
                date: i.date ? new Date(i.date) : new Date(),
                boardId: boardId,
                departmentId: deptId,
                sequenceNumber: i.subject || `Meeting ${i.id}`,
                meetingType: 'regular',
                attachments: i.attachments ? JSON.parse(i.attachments) : [],
                created_at: i.created_at ? new Date(i.created_at) : new Date(),
            };
        }
    },
    {
        file: 'board_acts.json', entity: BoardAct, skip: true, transform: (i) => {
            const deptId = parseInt(i.department_id);
            const boardId = deptBoardMap.get(deptId);
            if (!boardId) {
                console.warn(`No board found for department ${deptId} in act ${i.id}`);
                return null;
            }
            return {
                ...i,
                boardId: boardId,
                date: i.act_date ? new Date(i.act_date) : new Date(), // Map act_date -> date
                name: i.title || 'Untitled Act', // Map title -> name
                created_at: i.created_at ? new Date(i.created_at) : new Date(),
            };
        }
    },
    {
        file: 'agenda_points.json', entity: BoardAgenda, skip: true, transform: (i) => {
            const meetId = parseInt(i.board_meeting_id);
            const deptId = meetingDeptMap.get(meetId);

            // Critical Validation: Only process agenda if parent meeting is valid (has board)
            if (!deptId || !deptBoardMap.has(deptId)) {
                // console.warn(`Skipping Agenda ${i.id} - Orphaned Meeting ${meetId}`);
                return null;
            }

            const status = i.status === '1' ? DecisionStatus.ON_TARGET : DecisionStatus.ON_TARGET;
            let attachments = [];
            try {
                if (i.attachments) {
                    attachments = JSON.parse(i.attachments);
                }
            } catch (e) {
                console.warn(`Failed to parse attachments for agenda ${i.id}`);
            }

            return {
                ...i,
                description: i.item,
                decision: i.decision,
                status: status,
                boardMeetingId: meetId,
                attachments: attachments,
                created_at: i.created_at ? new Date(i.created_at) : new Date(),
            };
        },
        postProcess: async (item, entity) => {
            const deptIds = agendaDeptMap.get(entity.id);
            if (deptIds && deptIds.length > 0) {
                // We need to link related departments. 
                // Since this is M2M, we can't just set a column.
                // We'll rely on TypeORM's save method handling relations if we passed objects, 
                // OR we have to do it manually. 
                // Given the batch logic with 'save', we can pass { relatedDepartments: [{ id: 1 }] } if relation is set up to cascade.
                // Assuming cascade is not guaranteed or configured, we might need a separate query.
                // However, let's try populating the entity property with objects.
                entity.relatedDepartments = deptIds.map(id => ({ id }));
            }
        }
    },



    // 6. Activity Logs
    {
        file: 'activity_logs.json', entity: ActivityLog, skip: true, transform: (i) => {
            // Normalize Subject Type (action_model)
            let subjectType = i.action_model || 'System';
            if (subjectType.includes('\\')) {
                // Handle Namespaced classes: Modules\User\Entities\User -> User
                const parts = subjectType.split('\\');
                subjectType = parts[parts.length - 1];
            } else if (subjectType.length > 0) {
                // Handle table names: 'users' -> 'User'
                // Capitalize first letter
                subjectType = subjectType.charAt(0).toUpperCase() + subjectType.slice(1);
                // Remove trailing 's' if seemingly plural (naive but effective for standard tables)
                if (subjectType.endsWith('s') && !subjectType.endsWith('ss')) {
                    subjectType = subjectType.slice(0, -1);
                }
            }

            // Parse Properties (old/new values)
            let oldValues = null;
            let newValues = null;
            try {
                if (i.old_values) {
                    oldValues = typeof i.old_values === 'string' ? JSON.parse(i.old_values) : i.old_values;
                }
                if (i.new_values) {
                    newValues = typeof i.new_values === 'string' ? JSON.parse(i.new_values) : i.new_values;
                }
            } catch (e) {
                // If parsing fails, store as string
                oldValues = i.old_values;
                newValues = i.new_values;
            }

            const properties = {
                old: oldValues,
                new: newValues
            };

            // Map Action/Description
            // 'updated' -> 'updated'
            // 'login' -> 'login'
            const description = i.action || 'activity';

            return {
                userId: i.user_id ? parseInt(i.user_id) : null,
                id: i.id ? parseInt(i.id) : undefined, // Map ID to prevent duplicates
                causerId: i.user_id ? parseInt(i.user_id) : null, // Assuming user_id is the actor
                causerType: 'User',
                logName: 'default',
                description: description,
                subjectType: subjectType,
                subjectId: i.action_id ? parseInt(i.action_id) : null,
                properties: properties,
                ipAddress: i.ip,
                userAgent: i.user_agent,
                created_at: i.created_at ? new Date(i.created_at) : new Date(),
            };
        }
    },

    // 7. Roles & Permissions
    // 7. Roles & Permissions Pivot
    {
        file: 'permission_user.json',
        entity: PermissionUser,
        skip: true,
        transform: (i) => ({
            id: parseInt(i.id),
            permissionId: parseInt(i.permission_id),
            userId: parseInt(i.user_id),
        })
    },

    // 8. Candidates & Constituencies
    {
        file: 'constituencies.json', entity: Constituency, skip: true, transform: (i) => ({
            ...i,
            code: i.name, // Use name as code (e.g. NA-28)
            name: i.name,
            type: i.type,
            districtId: i.district_id ? parseInt(i.district_id) : null,
        })
    },
    { file: 'candidates.json', entity: Candidate, skip: true },

    // 9. Directives
    {
        file: 'directives.json', entity: Directive, skip: true, transform: (i) => ({
            ...i,
            letterNumber: i.letter_no || `DIR-${i.id}`,
            subject: i.subject || 'No Subject',
            issueDate: i.date ? new Date(i.date) : new Date(),
            timeline: i.timeline ? new Date(i.timeline) : new Date(),
            status: parseInt(i.status) || 1, // Map string "1" to number 1
            isArchived: i.is_archived === '1',
            comments: i.comments || '',
        })
    },
    { file: 'directive_replies.json', entity: DirectiveResponse, skip: true },

    // 10. Issues
    {
        file: 'issues.json', entity: Issue, skip: true, transform: (i) => {
            // Map legacy numeric types to IssueType enum (defaulting to OTHER)
            // 1: Public Complaint, 2: Media Report, etc. (Assumption or safe default)
            const typeMap = {
                '1': 'public_complaint',
                '2': 'media_report',
                '5': 'ptf_issue',
            };

            return {
                ...i,
                title: `Issue ${i.id} - ${i.issue_type}`, // Synthesize title
                description: i.detail || i.person_name || 'No details',
                type: typeMap[i.issue_type] || 'other',
                status: 'new',
                priority: 'normal',
                districtId: i.district_id ? parseInt(i.district_id) : null,
                primaryDepartmentId: i.department_id ? parseInt(i.department_id) : null,
                date: i.issue_date ? new Date(i.issue_date) : new Date(),
            };
        }
    },

    // 11. Meetings
    { file: 'meetings.json', entity: Meeting },

    // 12. Minutes
    { file: 'department_minute.json', entity: Minute, skip: true },
    { file: 'directive_replies.json', entity: Reply, skip: true },

    // 13. PTF
    {
        file: 'cm_ptf_responses.json', entity: PtfResponse, skip: true, transform: (i) => ({
            ...i,
            response: i.remarks || 'No Response',
            ptfIssueId: parseInt(i.ptf_issue_id),
            departmentId: parseInt(i.department_id),
            userId: i.created_by ? parseInt(i.created_by) : 1 // Default to admin if missing
        })
    },

    // 14. Schemes
    {
        file: 'annual_schemes.json', entity: AnnualScheme, skip: true, transform: (i) => ({
            ...i,
            name: i.name || 'Untitled Scheme',
            estimatedCost: i.cost ? parseFloat(i.cost) : 0,
            status: 'ongoing', // Default
            startDate: i.start_year ? new Date(`${i.start_year}-01-01`) : new Date(),
            departmentId: 1, // Default department strictly for legacy migration if map missing
            // Ideally map sub_sector_id to department, but we lack that map. 
            // We can try to use deptMap if sub_sector_id aligns or just dummy.
        })
    },

    // 15. KPI
    { file: 'kpi.json', entity: Kpi, skip: true },
    { file: 'kpi_data.json', entity: KpiData, skip: true },

    // 16. Khushhal
    { file: 'khushhal_progress.json', entity: KhushhalProgress, skip: true },
    { file: 'khushhal_replies.json', entity: KhushhalReply, skip: true },
    { file: 'khushhal_kpks.json', entity: KhushhalTask, skip: true },

    // 17. Inaugurations
    { file: 'inaugurations.json', entity: Inauguration, skip: true },

    // 18. Files
    { file: 'images.json', entity: File, skip: true },

    // 19. PTF Meetings
    {
        file: 'ptf_meetings.json', entity: PtfMeeting, skip: true, transform: (i) => ({
            ...i,
            date: i.date ? new Date(i.date) : new Date(),
            venue: i.venue || null,
            attendees: i.attendees || null,
            decisions: i.decisions || null,
        })
    },

    // 20. Tasks
    {
        file: 'tasks_tasks.json', entity: Task, transform: (i) => ({
            ...i,
            title: i.title || 'Untitled Task',
            description: i.description || 'No description provided',
            dueDate: i.due_date ? new Date(i.due_date) : new Date(),
            status: i.status || 'pending',
            priority: i.priority || 'normal',
            taskableType: i.taskable_type || null,
            taskableId: i.taskable_id ? parseInt(i.taskable_id) : null,
            assignedTo: i.assigned_to ? parseInt(i.assigned_to) : null,
        })
    },
];

async function migrateTable(config: MigrationConfig) {
    console.log(`Migrating ${config.file}...`);
    const data = await readJsonFile(config.file);
    if (!data.length) {
        console.log(`No data in ${config.file}.`);
        return;
    }
    if (config.skip) {
        console.log(`Skipping ${config.file}...`);
        return;
    }

    const repo = AppDataSource.getRepository(config.entity);
    const tableName = repo.metadata.tableName;
    const BATCH_SIZE = 1000;

    let success = 0;
    let fail = 0;
    let skipped = 0;

    // Get all existing IDs to skip efficiently
    // Warning: for very large tables this might be heavy, but better than N+1 queries.
    // However, activity_logs is large. Let's do batch existence checks or just on conflict ignore?
    // TypeORM save can handle duplicates with update, but we want to skip.
    // Let's use `createQueryBuilder().insert().values(batch).orIgnore().execute()` if possible, 
    // or just fetch IDs in chunks. 
    // For simplicity and safety with transforms, let's process objects and insert in batches.

    // We'll trust the database constraints to handle duplicates if we use `save`? 
    // No, `save` tries to update if id exists. That's fine for migration (idempotent).
    // But one-by-one is slow.
    // Let's build an array of entities and save in chunks.

    let batch = [];

    async function saveBatch(items: any[]) {
        if (!items.length) return;
        try {
            await repo.save(items, { chunk: 1000 });
            success += items.length;
        } catch (e) {
            console.error(`Batch save failed in ${config.file}: ${e.message}. Retrying one-by-one...`);
            for (const item of items) {
                try {
                    await repo.save(item);
                    success++;
                } catch (innerE) {
                    fail++;
                }
            }
        }
    }

    // Pre-load duplicates for Users
    if (config.file === 'users.json') {
        const existingUsers = await repo.find({ select: ['id', 'email'] }); // Fetch ID too
        existingUsers.forEach((u: any) => {
            if (u.email) userEmailMap.add(u.email);
            if (u.id) userIds.add(u.id); // Add to global ID set
        });
        console.log(`Loaded ${existingUsers.length} existing users.`);
    }

    // Pre-load User IDs if not already loaded (for other tables)
    if (userIds.size === 0 && config.file !== 'users.json') {
        const useRepo = AppDataSource.getRepository(User);
        const users = await useRepo.find({ select: ['id'] });
        users.forEach(u => userIds.add(u.id));
        console.log(`Loaded ${userIds.size} user IDs for FK validation.`);
    }

    // Pre-load duplicates for Users (Keep fetching for validation, but skip migration)
    if (config.file === 'users.json') {
        const dists = await AppDataSource.getRepository(District).find({ select: ['id'] });
        dists.forEach(d => districtIds.add(d.id));
        console.log(`Loaded ${districtIds.size} districts for FK validation.`);
    }

    // Load districts if not loaded
    if (districtIds.size === 0 && (config.file === 'complaints.json' || config.file === 'announcements.json')) {
        const dists = await AppDataSource.getRepository(District).find({ select: ['id'] });
        dists.forEach(d => districtIds.add(d.id));
        console.log(`Loaded ${districtIds.size} districts for FK validation.`);
    }

    // ... ID Loading for validation ...

    for (const item of data) {
        try {
            const entity = new config.entity();
            const transformed = config.transform ? config.transform(item) : {};
            if (!transformed) continue; // Skip item if transform returned null

            for (const key of Object.keys(item)) {
                if (key === 'id') {
                    entity.id = parseInt(item.id);
                    continue;
                }
                const camelKey = toCamel(key);

                // Special handling for createdBy/modifiedBy to prevent FK errors
                if (key === 'created_by' || key === 'modified_by') {
                    const uid = parseInt(item[key]);
                    // If user exists, use ID, else null
                    transformed[camelKey] = userIds.has(uid) ? uid : null;
                    continue;
                }
                // Validation Logic
                if (camelKey === 'departmentId' || key === 'department_id') {
                    const did = parseInt(item[key] || item['department_id']);
                    // Check deptMap for existence (deptMap keys are numbers)
                    transformed['departmentId'] = deptMap.has(did) ? did : null;
                    continue;
                }
                if (camelKey === 'districtId' || key === 'district_id') {
                    const did = parseInt(item[key] || item['district_id']);
                    transformed['districtId'] = districtIds.has(did) ? did : null;
                    continue;
                }

                if (transformed[camelKey] === undefined) {
                    const col = repo.metadata.findColumnWithPropertyName(camelKey);
                    if (col) {
                        if (col.type === 'boolean' || col.propertyName.startsWith('is') || col.propertyName.startsWith('has')) {
                            transformed[camelKey] = item[key] === '1' || item[key] === 'true' || item[key] === true;
                        } else if (col.type === 'timestamp' || col.type === 'date' || col.type === 'datetime') {
                            // Fix: Don't set null for mandatory timestamps like created_at. Use current date if missing.
                            transformed[camelKey] = item[key] ? new Date(item[key]) : new Date();
                        } else if (col.type === 'text' || col.type === 'varchar') {
                            // Fix: Don't allow null for text fields that might be mandatory (like detail, title)
                            transformed[camelKey] = item[key] || '';
                        } else {
                            transformed[camelKey] = item[key];
                        }
                    }
                }
            }

            // Board Member Fix
            if (config.entity.name === 'BoardMember' && !transformed.appointmentDate) {
                transformed.appointmentDate = new Date();
            }

            Object.assign(entity, transformed);

            // Skip invalid Board Members
            if (config.entity.name === 'BoardMember' && !entity.boardId) {
                // console.log(`Skipping BoardMember ${item.id} - No Board for Dept ${item.department_id}`);
                skipped++;
                continue;
            }

            if (config.postProcess) {
                config.postProcess(item, entity);
            }

            batch.push(entity);

            if (batch.length >= BATCH_SIZE) {
                await saveBatch(batch);
                // It's much faster than one by one.
                console.log(`Processed ${success} / ${data.length} records in ${config.file}`);
                batch = [];
            }
        } catch (e) {
            console.error(`Error processing item in ${config.file}:`, e.message);
            fail++;
        }
    }

    // Final batch (already handled by saveBatch called after loop)
    await saveBatch(batch);

    // Reset sequence
    try {
        await AppDataSource.query(`SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), coalesce(max(id), 1)) FROM ${tableName};`);
    } catch (e) { }

    console.log(`Finished ${config.file}: ${success} processed, ${fail} failed, ${skipped} skipped.`);
}

async function main() {
    await AppDataSource.initialize();

    // 0. Ensure Province
    const provinceRepo = AppDataSource.getRepository(Province);
    if (!await provinceRepo.findOne({ where: { id: 1 } })) {
        await provinceRepo.save({ id: 1, name: 'Khyber Pakhtunkhwa' });
    }

    // Run configured migrations
    console.log('Loading departments for lookup...');
    const depRepo = AppDataSource.getRepository(Department);
    const deps = await depRepo.find();
    deps.forEach(d => deptMap.set(d.id, d.name));

    // Load Lookups
    try {
        await loadAgendaDeptMap();
    } catch (e) {
        console.error('Failed to pre-load maps:', e);
    }

    // Process migration map
    for (const config of MIGRATION_MAP) {
        await migrateTable(config);
    }

    console.log('Migration Complete.');
    process.exit(0);
}

main();
