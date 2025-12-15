# CMDMS Database Schema Overview

This document provides a comprehensive overview of the database schema for the Chief Minister's Decision Management System (CMDMS).

## Schema Organization

The database consists of **170+ tables** organized into the following categories:

### 1. Core Tables (8 tables)
- `provinces` - KPK provinces
- `districts` - Districts within provinces
- `departments` - Government departments
- `department_types` - Types: RecordNote, Board, Sectorial, DC
- `roles` - User roles (Admin, Department, CM, CS, etc.)
- `permissions` - Granular permissions
- `user_groups` - User group classifications
- `users` - System users

### 2. Pivot Tables (20+ tables)
- `user_departments` - Users assigned to multiple departments
- `permission_user` - User-specific permissions
- `department_minute` - Departments assigned to decisions with individual status
- `department_directive` - Departments assigned to directives
- `announcement_detail_other_departments` - Multi-department announcements
- `department_sector_agenda_point` - Sectorial meeting department assignments
- `department_khushhal_kpk` - Khushhal KPK program department tracking
- `cm_remark_department` - CM remarks multi-department assignments
- `activity_department` - Intervention activities department tracking
- `tasks_department_task` - Generic task system department assignments
- `taggables` - Polymorphic tagging system
- And more...

### 3. Meetings System (15+ tables)
- `meeting_types` - Normal, Cabinet, PTF, PMRU, Board, Sectorial, Senate
- `meetings` - CM meetings
- `minutes` - Meeting decisions/minutes
- `replies` - Department responses to decisions
- `letters` - Official letters generated from decisions
- `board_meetings` - Board meetings
- `board_details` - Board configurations
- `board_members` - Board membership
- `board_acts` - Board acts/regulations
- `agenda_points` - Board meeting agenda items
- `sectorial_meetings` - Sector-specific meetings
- `sectorial_agenda_points` - Sectorial agenda items
- `review_meetings` - Departmental review meetings
- `senate_meetings` - University senate meetings
- `senate_minutes` - Senate decisions
- `senate_members` - Senate membership
- `senate_meeting_observations` - Senate observations

### 4. Directives & Announcements (6 tables)
- `directives` - Official directives from CM
- `directive_replies` - Department responses
- `announcements` - Government announcements
- `announcement_details` - Announcement sub-tasks
- `announcement_replies` - Responses to announcements

### 5. Complaints & Issues (5 tables)
- `complaints` - Public complaints
- `complaint_replies` - Complaint responses
- `issues` - HCM Public Affairs issues
- `issue_documents` - Issue attachments

### 6. PTF System (8 tables)
- `ptf_priorities` - PTF priority levels
- `ptf_sources` - PTF issue sources
- `ptf_issues` - Prime Task Force issues
- `ptf_assignments` - Department assignments
- `ptf_history` - Full action history
- `ptf_meetings` - PTF meetings
- `meeting_issues` - PTF meeting-issue associations
- `cm_ptf_responses` - CM responses to PTF issues

### 7. Special Initiatives (8 tables)
- `khushhal_kpks` - Khushhal KPK program tasks
- `khushhal_progress` - Progress tracking
- `khushhal_replies` - Department responses
- `pti_initiatives` - PTI party initiatives
- `sections` - Government sections (CM Secretariat, CS Office, etc.)
- `cm_remarks` - CM remarks and instructions
- `cm_remark_replies` - Responses to CM remarks
- `interventions` - Special interventions/projects
- `activities` - Intervention activities
- `activity_replies` - Activity responses

### 8. Development Schemes (10 tables)
- `sectors` - Development sectors (Education, Health, etc.)
- `sub_sectors` - Sub-sectors (Primary Education, BHUs, etc.)
- `annual_schemes` - Development schemes
- `costs` - Scheme costing details
- `allocations` - Budget allocations
- `expenditures` - Expenditure tracking
- `scheme_revisions` - Scheme modifications
- `fund_distributions` - Fund distribution records
- `through_forwards` - Approval workflow tracking

### 9. Political Management (7 tables)
- `parties` - Political parties
- `constituencies` - Electoral constituencies
- `candidates` - MNA/MPA candidates
- `candidate_requests` - Candidate requests
- `officers` - Government officers
- `officer_departments` - Officer-department assignments

### 10. Performance Tracking (9 tables)
- `kpis` - Key Performance Indicators
- `kpi_columns` - KPI metric columns
- `kpi_data` - KPI data entries
- `public_days` - CM public interaction days
- `welfare_initiatives` - Welfare programs
- `inaugurations` - Project inaugurations/ground breaking

### 11. Generic Systems (10 tables)
- `tasks_tasks` - Generic task system (polymorphic)
- `task_comments` - Threaded task comments
- `task_attachments` - Polymorphic file attachments
- `tags` - Tagging system
- `activity_logs` - Full audit trail
- `notifications` - User notifications

## Key Design Patterns

### Polymorphic Relationships
- **Tags**: Can be attached to minutes, directives, announcements, issues, tasks, etc.
- **Tasks**: Can be linked to any module (PtiInitiative, KhushhalKpk, etc.)
- **Attachments**: Can be associated with multiple entity types

### Multi-Department Tracking
Many modules support assigning multiple departments with individual:
- Status per department
- Remarks/progress per department
- Timeline/due date per department
- Creator/modifier tracking

Examples: `department_minute`, `department_directive`, `announcement_detail_other_departments`

### Audit Trail
All major entities include:
- `created_by` - User who created the record
- `modified_by` - User who last modified
- `created_at` - Creation timestamp
- `updated_at` - Last modification timestamp

### Status Management
Consistent status enum (`DecisionStatus`) used across modules:
- Completed (1)
- On Target (2)
- Overdue (3)
- Off Target (4)
- Ongoing (7)
- Overdue Other Reason (6)
- Off Target Other Reason (9)

### Soft Deletes
Certain entities support soft deletion:
- `users.is_active` - Users can be deactivated
- `departments.active` - Departments can be marked inactive
- `minutes.is_archived` - Minutes can be archived

## Database Naming Conventions

- **Tables**: snake_case, plural (e.g., `annual_schemes`, `department_types`)
- **Columns**: snake_case (e.g., `created_at`, `user_group_id`)
- **Foreign Keys**: `{table_singular}_id` (e.g., `department_id`, `meeting_id`)
- **Pivot Tables**: `{table1}_{table2}` or descriptive names
- **Timestamps**: `created_at`, `updated_at` (standard Laravel/NestJS convention)

## Indexes

Key indexes for performance:
- Primary keys on all tables (`id`)
- Foreign key indexes
- Unique indexes on email addresses, codes, etc.
- Composite indexes on frequently queried combinations
- Date indexes for timeline-based queries

## Migration Strategy

Migrations are organized sequentially:
1. **Base tables** (provinces, districts, departments, roles, users)
2. **Pivot tables** (user_departments, permission_user)
3. **Module tables** by dependency order
4. **Polymorphic tables** (tags, tasks, attachments)
5. **Audit tables** (activity_logs, notifications)

## Entity Relationships Summary

```
User (n) ─────────── (1) Role
User (n) ─────────── (1) Department (primary)
User (n) ─────────── (n) Department (via user_departments)
User (n) ─────────── (n) Permission (via permission_user)
User (n) ─────────── (1) User (manager, self-reference)

Department (n) ─────── (1) DepartmentType
Department (n) ─────── (1) District
Department (n) ─────── (1) Department (parent, self-reference)

District (n) ────────── (1) Province

Meeting (n) ─────────── (1) Department
Meeting (n) ─────────── (1) MeetingType
Meeting (1) ─────────── (n) Minute

Minute (n) ─────────── (1) Meeting
Minute (n) ─────────── (n) Department (via department_minute)
Minute (1) ─────────── (n) Reply
Minute (1) ─────────── (n) Letter
Minute (n) ─────────── (n) Tag (polymorphic)

Directive (n) ───────── (n) Department (via department_directive)
Directive (1) ───────── (n) DirectiveReply

Announcement (n) ─────── (1) District
Announcement (1) ─────── (n) AnnouncementDetail
AnnouncementDetail (n) ─ (1) Department (primary)
AnnouncementDetail (n) ─ (n) Department (via pivot)

... (and 150+ more relationships)
```

## Next Steps

1. Run migrations: `npm run migration:run`
2. Run seeders: `npm run seed`
3. Verify schema in PostgreSQL
4. Test with sample data

For detailed entity definitions, see:
- `/src/modules/*/entities/*.entity.ts`
- `/src/database/migrations/`

For API endpoints using this schema, see:
- Swagger Documentation: `http://localhost:3000/api/docs`
- Module controllers: `/src/modules/*/controllers/`

