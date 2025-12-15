import { DataSource } from 'typeorm';
import { Permission } from '../../modules/permissions/entities/permission.entity';

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);

  const permissions = [
    // User Management
    { name: 'user.list', displayName: 'List Users', category: 'users', module: 'Users' },
    { name: 'user.view', displayName: 'View User', category: 'users', module: 'Users' },
    { name: 'user.create', displayName: 'Create User', category: 'users', module: 'Users' },
    { name: 'user.edit', displayName: 'Edit User', category: 'users', module: 'Users' },
    { name: 'user.delete', displayName: 'Delete User', category: 'users', module: 'Users' },

    // Role Management
    { name: 'role.list', displayName: 'List Roles', category: 'roles', module: 'Roles' },
    { name: 'role.view', displayName: 'View Role', category: 'roles', module: 'Roles' },
    { name: 'role.create', displayName: 'Create Role', category: 'roles', module: 'Roles' },
    { name: 'role.edit', displayName: 'Edit Role', category: 'roles', module: 'Roles' },
    { name: 'role.delete', displayName: 'Delete Role', category: 'roles', module: 'Roles' },

    // Permission Management
    { name: 'permission.list', displayName: 'List Permissions', category: 'permissions', module: 'Permissions' },
    { name: 'permission.assign', displayName: 'Assign Permissions', category: 'permissions', module: 'Permissions' },

    // Department Management
    { name: 'department.list', displayName: 'List Departments', category: 'department', module: 'Departments' },
    { name: 'department.view', displayName: 'View Department', category: 'department', module: 'Departments' },
    { name: 'department.create', displayName: 'Create Department', category: 'department', module: 'Departments' },
    { name: 'department.edit', displayName: 'Edit Department', category: 'department', module: 'Departments' },

    // Meetings
    { name: 'meeting.list', displayName: 'List Meetings', category: 'meetings', module: 'Meetings' },
    { name: 'meeting.view', displayName: 'View Meeting', category: 'meetings', module: 'Meetings' },
    { name: 'meeting.create', displayName: 'Create Meeting', category: 'meetings', module: 'Meetings' },
    { name: 'meeting.edit', displayName: 'Edit Meeting', category: 'meetings', module: 'Meetings' },
    { name: 'meeting.delete', displayName: 'Delete Meeting', category: 'meetings', module: 'Meetings' },

    // Minutes
    { name: 'minute.list', displayName: 'List Minutes', category: 'minutes', module: 'Minutes' },
    { name: 'minute.view', displayName: 'View Minute', category: 'minutes', module: 'Minutes' },
    { name: 'minute.create', displayName: 'Create Minute', category: 'minutes', module: 'Minutes' },
    { name: 'minute.edit', displayName: 'Edit Minute', category: 'minutes', module: 'Minutes' },
    { name: 'minute.reply', displayName: 'Reply to Minute', category: 'minutes', module: 'Minutes' },
    { name: 'minute.archive', displayName: 'Archive Minute', category: 'minutes', module: 'Minutes' },

    // Directives
    { name: 'directive.list', displayName: 'List Directives', category: 'directives', module: 'Directives' },
    { name: 'directive.view', displayName: 'View Directive', category: 'directives', module: 'Directives' },
    { name: 'directive.create', displayName: 'Create Directive', category: 'directives', module: 'Directives' },
    { name: 'directive.edit', displayName: 'Edit Directive', category: 'directives', module: 'Directives' },
    { name: 'directive.respond', displayName: 'Respond to Directive', category: 'directives', module: 'Directives' },

    // Announcements
    { name: 'announcement.list', displayName: 'List Announcements', category: 'announcements', module: 'Announcements' },
    { name: 'announcement.view', displayName: 'View Announcement', category: 'announcements', module: 'Announcements' },
    { name: 'announcement.create', displayName: 'Create Announcement', category: 'announcements', module: 'Announcements' },
    { name: 'announcement.edit', displayName: 'Edit Announcement', category: 'announcements', module: 'Announcements' },
    { name: 'announcement.respond', displayName: 'Respond to Announcement', category: 'announcements', module: 'Announcements' },

    // Complaints
    { name: 'complaint.list', displayName: 'List Complaints', category: 'complaints', module: 'Complaints' },
    { name: 'complaint.view', displayName: 'View Complaint', category: 'complaints', module: 'Complaints' },
    { name: 'complaint.update', displayName: 'Update Complaint', category: 'complaints', module: 'Complaints' },
    { name: 'complaint.respond', displayName: 'Respond to Complaint', category: 'complaints', module: 'Complaints' },

    // Issues
    { name: 'issue.list', displayName: 'List Issues', category: 'issues', module: 'Issues' },
    { name: 'issue.view', displayName: 'View Issue', category: 'issues', module: 'Issues' },
    { name: 'issue.create', displayName: 'Create Issue', category: 'issues', module: 'Issues' },
    { name: 'issue.assign', displayName: 'Assign Issue', category: 'issues', module: 'Issues' },
    { name: 'issue.update', displayName: 'Update Issue', category: 'issues', module: 'Issues' },

    // Tasks
    { name: 'task.list', displayName: 'List Tasks', category: 'tasks', module: 'Tasks' },
    { name: 'task.view', displayName: 'View Task', category: 'tasks', module: 'Tasks' },
    { name: 'task.create', displayName: 'Create Task', category: 'tasks', module: 'Tasks' },
    { name: 'task.update', displayName: 'Update Task', category: 'tasks', module: 'Tasks' },
    { name: 'task.comment', displayName: 'Comment on Task', category: 'tasks', module: 'Tasks' },

    // KPI
    { name: 'kpi.list', displayName: 'List KPIs', category: 'kpi', module: 'KPI' },
    { name: 'kpi.view', displayName: 'View KPI', category: 'kpi', module: 'KPI' },
    { name: 'kpi.create', displayName: 'Create KPI', category: 'kpi', module: 'KPI' },
    { name: 'kpi.submit_data', displayName: 'Submit KPI Data', category: 'kpi', module: 'KPI' },

    // Reports
    { name: 'report.view', displayName: 'View Reports', category: 'reports', module: 'Reports' },
    { name: 'report.export', displayName: 'Export Reports', category: 'reports', module: 'Reports' },

    // Activity Logs
    { name: 'activity_log.view', displayName: 'View Activity Logs', category: 'activity_logs', module: 'Activity Logs' },
  ];

  for (const permissionData of permissions) {
    const existing = await permissionRepository.findOne({ where: { name: permissionData.name } });
    if (!existing) {
      const permission = permissionRepository.create(permissionData);
      await permissionRepository.save(permission);
      console.log(`✓ Created permission: ${permissionData.name}`);
    } else {
      console.log(`- Permission already exists: ${permissionData.name}`);
    }
  }

  console.log(`✓ Total permissions seeded: ${permissions.length}`);
}

