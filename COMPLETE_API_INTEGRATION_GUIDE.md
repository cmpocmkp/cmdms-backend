# CMDMS Complete API Integration Guide

**Base URL:** `https://cmdms-backend-production.up.railway.app`  
**API Base Path:** `/api`  
**Full API Path:** `https://cmdms-backend-production.up.railway.app/api`

> **Authentication:** All endpoints (except login) require `Authorization: Bearer YOUR_ACCESS_TOKEN` header.

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Department Management](#department-management)
4. [Minutes/Record Notes](#minutesrecord-notes)
5. [Directives](#directives)
6. [Announcements](#announcements)
7. [CM Remarks](#cm-remarks)
8. [PTF (Provincial Task Force)](#ptf-provincial-task-force)
9. [PTIs (Priority Transformation Initiatives)](#ptis)
10. [Summaries](#summaries)
11. [Trackers/Interventions](#trackersinterventions)
12. [Board Meetings & Agendas](#board-meetings--agendas)
13. [Sectoral Meetings](#sectoral-meetings)
14. [Schemes & Annual Schemes](#schemes--annual-schemes)
15. [Inaugurations](#inaugurations)
16. [Khushhal KPK](#khushhal-kpk)
17. [Tasks](#tasks)
18. [Reports (All Types)](#reports)
19. [Files & Uploads](#files--uploads)
20. [Notifications](#notifications)
21. [Common APIs](#common-apis)

---

## Authentication & Authorization

### 1. Login
**POST** `/api/auth/login`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@cmdms.gov.pk",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@cmdms.gov.pk",
      "roleId": 1,
      "role": {"id": 1, "name": "Admin"},
      "departmentId": 1,
      "department": {"id": 1, "name": "CM Secretariat"}
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Get Current User
**GET** `/api/auth/me`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/auth/me' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Refresh Token
**POST** `/api/auth/refresh`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/refresh' \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

### 4. Logout
**POST** `/api/auth/logout`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/logout' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 5. Password Reset Request
**POST** `/api/auth/forgot-password`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/forgot-password' \
  -H 'Content-Type: application/json' \
  -d '{"email": "user@cmdms.gov.pk"}'
```

### 6. Reset Password
**POST** `/api/auth/reset-password`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/reset-password' \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "RESET_TOKEN",
    "password": "newPassword123",
    "confirmPassword": "newPassword123"
  }'
```

---

## User Management

### 1. List Users
**GET** `/api/users`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/users?page=1&limit=10&roleId=2&search=john&sortBy=name&sortOrder=asc' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "John Doe",
      "email": "john@cmdms.gov.pk",
      "phone": "+92-300-1234567",
      "roleId": 2,
      "role": {"id": 2, "name": "Department User"},
      "departmentId": 5,
      "department": {"id": 5, "name": "Education"},
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {"total": 150, "page": 1, "limit": 10, "totalPages": 15}
}
```

### 2. Get User Details
**GET** `/api/v1/users/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/users/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create User
**POST** `/api/v1/users`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/users' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Jane Smith",
    "email": "jane@cmdms.gov.pk",
    "password": "password123",
    "phone": "+92-300-9876543",
    "roleId": 2,
    "departmentId": 10,
    "userGroupId": 2,
    "managerId": 5
  }'
```

### 4. Update User
**PUT** `/api/v1/users/:id`

```bash
curl -X PUT 'https://cmdms-backend-production.up.railway.app/api/v1/users/2' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name": "John Updated", "isActive": true}'
```

### 5. Delete User
**DELETE** `/api/v1/users/:id`

```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/v1/users/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 6. Assign User Permissions
**PUT** `/api/v1/users/:id/permissions`

```bash
curl -X PUT 'https://cmdms-backend-production.up.railway.app/api/v1/users/2/permissions' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"permissionIds": [1, 5, 10, 15]}'
```

---

## Department Management

### 1. List Departments
**GET** `/api/v1/departments`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/departments?page=1&limit=20&type=department&search=health' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get Department
**GET** `/api/v1/departments/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/departments/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create Department
**POST** `/api/v1/departments`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/departments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "IT Department",
    "code": "IT",
    "type": "department",
    "parentId": null,
    "districtId": null
  }'
```

---

## Minutes/Record Notes

### 1. List Minutes
**GET** `/api/v1/minutes`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/minutes?page=1&limit=10&meetingId=5&status=1&departmentId=15&fromDate=2024-01-01&toDate=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "meetingId": 5,
      "meeting": {
        "id": 5,
        "title": "Cabinet Meeting January 2024",
        "date": "2024-01-10"
      },
      "heading": "Health Infrastructure Development",
      "issues": "Current status of hospital construction",
      "decisions": "Approve additional funding",
      "responsibility": "Secretary Health",
      "timeline": "2024-06-30",
      "status": 2,
      "departments": [{"id": 15, "name": "Health", "status": 2}],
      "replyCount": 3,
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  ],
  "meta": {"total": 50, "page": 1, "limit": 10}
}
```

### 2. Get Minute Details
**GET** `/api/v1/minutes/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/minutes/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create Minute
**POST** `/api/v1/minutes`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/minutes' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "meetingId": 5,
    "heading": "Education Reforms",
    "issues": "Teacher shortage",
    "decisions": "Hire 1000 teachers",
    "responsibility": "Secretary Education",
    "timeline": "2024-08-31",
    "status": 1,
    "departmentIds": [8, 15]
  }'
```

### 4. Update Minute
**PUT** `/api/v1/minutes/:id`

```bash
curl -X PUT 'https://cmdms-backend-production.up.railway.app/api/v1/minutes/1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status": 2, "progressHistory": "In progress"}'
```

### 5. Create Minute Reply
**POST** `/api/v1/minutes/:id/replies`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/minutes/1/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Progress update: 50% complete",
    "status": 2,
    "progress": 50,
    "attachments": ["report.pdf"]
  }'
```

### 6. List Minute Replies
**GET** `/api/v1/minutes/:id/replies`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/minutes/1/replies?page=1&limit=10&departmentId=15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Directives

### 1. List Directives
**GET** `/api/v1/directives`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/directives?page=1&status=1&priority=high&departmentId=15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get Directive
**GET** `/api/v1/directives/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/directives/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create Directive
**POST** `/api/v1/directives`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/directives' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "IT Infrastructure Upgrade",
    "description": "Modernize government IT systems",
    "referenceNumber": "DIR-2024-050",
    "priority": "medium",
    "deadline": "2024-12-31",
    "departmentIds": [20, 25]
  }'
```

### 4. Create Directive Reply
**POST** `/api/v1/directives/:id/replies`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/directives/10/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content": "Implementation started", "status": 2, "progress": 30}'
```

---

## Announcements

### 1. List Announcements
**GET** `/api/v1/announcements`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/announcements?page=1&status=active' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Create Announcement
**POST** `/api/v1/announcements`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/announcements' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "New Policy Announcement",
    "description": "Details of new policy",
    "date": "2024-01-20",
    "departmentIds": [10, 15, 20]
  }'
```

---

## CM Remarks

### 1. List CM Remarks
**GET** `/api/v1/cm-remarks`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/cm-remarks?page=1&priority=high' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Create CM Remark
**POST** `/api/v1/cm-remarks`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/cm-remarks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "subject": "Infrastructure Development",
    "remark": "Accelerate road construction projects",
    "priority": "high",
    "deadline": "2024-06-30",
    "departmentIds": [5, 10]
  }'
```

---

## PTF (Provincial Task Force)

### 1. List PTF Issues
**GET** `/api/v1/ptf/issues`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/ptf/issues?page=1&districtId=5&status=pending&type=on-target' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get PTF Issue
**GET** `/api/v1/ptf/issues/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create PTF Issue
**POST** `/api/v1/ptf/issues`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/ptf/issues' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Water Supply Issue",
    "description": "Water scarcity in rural areas",
    "priority": "high",
    "districtId": 5,
    "departmentId": 10,
    "sourceId": 1,
    "suggestedDepartments": [10, 15],
    "wayForward": "Install new pipelines"
  }'
```

### 4. Create PTF Response
**POST** `/api/v1/ptf/issues/:id/responses`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/ptf/issues/20/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "departmentId": 10,
    "response": "Pipeline installation in progress",
    "attachments": ["pipeline_plan.pdf"]
  }'
```

### 5. PTF Dashboard Report
**GET** `/api/v1/reports/ptf/dashboard`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/reports/ptf/dashboard?year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## PTIs

### 1. List PTIs
**GET** `/api/v1/ptis`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/ptis?page=1&status=active' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get PTI Details
**GET** `/api/v1/ptis/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/ptis/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create PTI
**POST** `/api/v1/ptis`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/ptis' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Digital Transformation Initiative",
    "description": "Modernize government services",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### 4. Create PTI Task
**POST** `/api/v1/ptis/:id/tasks`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/ptis/5/tasks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Implement Online Portal",
    "description": "Launch citizen services portal",
    "departmentIds": [10, 15],
    "deadline": "2024-06-30"
  }'
```

---

## Summaries

### 1. List Summaries
**GET** `/api/v1/summaries`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/summaries?page=1&status=pending' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get Summary
**GET** `/api/v1/summaries/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/summaries/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create Summary
**POST** `/api/v1/summaries`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/summaries' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "referenceNumber": "SUM-2024-001",
    "subject": "Quarterly Review",
    "description": "Q1 2024 performance review",
    "date": "2024-04-01",
    "initiatorDepartmentId": 1
  }'
```

---

## Trackers/Interventions

### 1. List Trackers
**GET** `/api/v1/trackers`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/trackers?page=1&type=intervention&status=active' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Create Tracker
**POST** `/api/v1/trackers`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/trackers' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "COVID-19 Response Tracker",
    "description": "Track pandemic response activities",
    "type": "intervention",
    "budget": 10000000,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "departmentIds": [5, 10, 15]
  }'
```

---

## Board Meetings & Agendas

### 1. List Board Meetings
**GET** `/api/v1/boards/meetings`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/boards/meetings?page=1&boardId=2&status=scheduled' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get Board Meeting
**GET** `/api/v1/boards/meetings/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/boards/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. List Board Agendas
**GET** `/api/v1/boards/agendas`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/boards/agendas?meetingId=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 4. Create Board Agenda Reply
**POST** `/api/v1/boards/agendas/:id/replies`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/boards/agendas/5/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content": "Action taken as per decision", "status": 2}'
```

---

## Schemes & Annual Schemes

### 1. List Annual Schemes
**GET** `/api/v1/schemes/annual`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/schemes/annual?page=1&year=2024&status=approved' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get Annual Scheme
**GET** `/api/v1/schemes/annual/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/schemes/annual/50' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create Annual Scheme
**POST** `/api/v1/schemes/annual`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/schemes/annual' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Rural Development Scheme 2024",
    "code": "RDS-2024-001",
    "sector": "Infrastructure",
    "estimatedCost": 50000000,
    "departmentId": 10
  }'
```

### 4. Scheme Costs Management
**GET** `/api/v1/schemes/annual/:id/costs`
**POST** `/api/v1/schemes/annual/:id/costs`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/schemes/annual/50/costs' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"description": "Labor costs", "amount": 5000000}' ```

---

## Inaugurations

### 1. List Inaugurations
**GET** `/api/v1/inaugurations`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/inaugurations?page=1&year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Create Inauguration
**POST** `/api/v1/inaugurations`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/inaugurations' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Hospital Inauguration",
    "description": "Opening of new district hospital",
    "date": "2024-02-15",
    "type": "inauguration",
    "departmentId": 15,
    "districtId": 5,
    "projectCost": 100000000
  }'
```

---

## Khushhal KPK

### 1. List Khushhal Programs
**GET** `/api/v1/khushhal-kpk`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/khushhal-kpk?page=1&status=active' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Get Khushhal Program
**GET** `/api/v1/khushhal-kpk/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/khushhal-kpk/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. List Khushhal Progress
**GET** `/api/v1/khushhal-kpk/:id/progress`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/khushhal-kpk/10/progress?departmentId=15&type=monthly' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 4. Create Khushhal Progress
**POST** `/api/v1/khushhal-kpk/:id/progress`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/khushhal-kpk/10/progress' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "departmentId": 15,
    "type": "monthly",
    "progress": 75,
    "status": 2,
    "attachments": ["progress_report.pdf"]
  }'
```

---

## Tasks

### 1. Get Task Details
**GET** `/api/v1/tasks/:id`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/tasks/100' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. List Task Comments
**GET** `/api/v1/tasks/:id/comments`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/tasks/100/comments?page=1&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Create Task Comment
**POST** `/api/v1/tasks/:id/comments`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/tasks/100/comments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Progress update on task",
    "status": 2,
    "remarks": "On schedule",
    "reason": "Completed milestone",
    "taggedDepartments": [10, 15],
    "attachments": ["update.pdf"]
  }'
```

### 4. Update Department Task Status
**PUT** `/api/v1/tasks/:id/departments/:departmentId/status`

```bash
curl -X PUT 'https://cmdms-backend-production.up.railway.app/api/v1/tasks/100/departments/15/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status": 2, "progress": 80}'
```

---

## Reports

### 1. Department-Wise Report
**GET** `/api/v1/reports/department-wise`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/reports/department-wise?fromDate=2024-01-01&toDate=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Cabinet Meetings Report
**GET** `/api/v1/reports/cabinet-meetings`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/reports/cabinet-meetings?year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Cabinet Detail Report
**GET** `/api/v1/reports/cabinet/detail`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/reports/cabinet/detail?departmentId=15&status=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 4. Board Meetings Report
**GET** `/api/v1/reports/board-meetings`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/reports/board-meetings?boardId=2&year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 5. PTF Reports
**GET** `/api/v1/reports/ptf/district-wise`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/reports/ptf/district-wise?year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 6. KPI Data Reports
**GET** `/api/v1/reports/kpi/dc`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/reports/kpi/dc?fromDate=2024-01-01&toDate=2024-12-31&userId=25' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Files & Uploads

### 1. Upload Single File
**POST** `/api/v1/files/upload`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/files/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/document.pdf' \
  -F 'attachableType=minute' \
  -F 'attachableId=123'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 500,
    "originalName": "document.pdf",
    "fileName": "uuid-document.pdf",
    "filePath": "uploads/2024/01/uuid-document.pdf",
    "mimeType": "application/pdf",
    "size": 1048576,
    "url": "https://cdn.cmdms.gov.pk/uploads/2024/01/uuid-document.pdf"
  }
}
```

### 2. Upload Multiple Files
**POST** `/api/v1/files/upload-multiple`

```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/v1/files/upload-multiple' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'files=@/path/to/doc1.pdf' \
  -F 'files=@/path/to/doc2.pdf'
```

### 3. Download File
**GET** `/api/v1/files/:id/download`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/files/500/download' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -o downloaded_file.pdf
```

### 4. Delete File
**DELETE** `/api/v1/files/:id`

```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/v1/files/500' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Notifications

### 1. List Notifications
**GET** `/api/v1/notifications`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/notifications?page=1&unread=true' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 100,
      "title": "New Minute Assigned",
      "message": "You have been assigned a new minute",
      "type": "minute",
      "isRead": false,
      "actionUrl": "/minutes/256",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {"total": 50, "unreadCount": 25}
}
```

### 2. Mark as Read
**PUT** `/api/v1/notifications/:id/read`

```bash
curl -X PUT 'https://cmdms-backend-production.up.railway.app/api/v1/notifications/100/read' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Mark All as Read
**PUT** `/api/v1/notifications/read-all`

```bash
curl -X PUT 'https://cmdms-backend-production.up.railway.app/api/v1/notifications/read-all' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Common APIs

### 1. Departments Dropdown
**GET** `/api/v1/common/departments/dropdown`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/common/departments/dropdown?type=department' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Users Dropdown
**GET** `/api/v1/common/users/dropdown`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/common/users/dropdown?roleId=2&departmentId=15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 3. Global Search
**GET** `/api/v1/search`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/search?q=health&module=minutes' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 4. Export to Excel
**GET** `/api/v1/export/excel`

```bash
curl 'https://cmdms-backend-production.up.railway.app/api/v1/export/excel?type=users&filters={roleId:2}' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -o export.xlsx
```

---

## Response Format

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {"field": "email", "message": "Email is required"}
    ]
  }
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Query Parameters

Common parameters for list endpoints:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Text search
- `sortBy` - Sort field
- `sortOrder` - `asc` or `desc`
- `status` - Filter by status
- `departmentId` - Filter by department
- `fromDate` / `toDate` - Date range filter

---

## Complete API Reference

For detailed endpoint information for all 400+ APIs, refer to the patterns above. All modules follow similar CRUD conventions:

**Additional Modules:**
- Complaints: `/api/v1/complaints/*`
- Issues: `/api/v1/issues/*`
- Welfare: `/api/v1/welfare/*`
- Tags: `/api/v1/tags/*`
- Roles: `/api/v1/roles/*`
- Permissions: `/api/v1/permissions/*`
- Activity Logs: `/api/v1/activity-logs/*`
- Candidates: `/api/v1/candidates/*`
- Officers: `/api/v1/officers/*`

---

**For complete coverage of all endpoints and modules, this guide covers the patterns and examples for all 400+ APIs across the CMDMS platform.**
