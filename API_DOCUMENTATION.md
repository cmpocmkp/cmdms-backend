# CMDMS Backend - API Documentation

## 🔗 **Base URL**

```
Development: http://localhost:3000
Production: https://api.cmdms.gov.pk
```

## 📚 **Interactive Documentation**

Swagger UI: `http://localhost:3000/api/docs`

---

## 🔐 **Authentication**

All endpoints (except `/auth/login`) require JWT authentication.

### **Headers**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### **Login**
```http
POST /auth/login
```

**Request:**
```json
{
  "email": "admin@cmdms.gov.pk",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "System Administrator",
    "email": "admin@cmdms.gov.pk",
    "role": {
      "id": 1,
      "name": "Admin"
    }
  }
}
```

---

## 📊 **API Endpoints**

### **1. Authentication** (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### **2. Users** (`/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users with pagination |
| GET | `/users/:id` | Get user details |
| POST | `/users` | Create new user |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### **3. Roles** (`/roles`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles` | List all roles |
| GET | `/roles/:id` | Get role details |
| POST | `/roles` | Create new role |
| PATCH | `/roles/:id` | Update role |
| DELETE | `/roles/:id` | Delete role |
| POST | `/roles/:id/permissions` | Assign permissions to role |

### **4. Departments** (`/departments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departments` | List all departments |
| GET | `/departments/:id` | Get department details |
| POST | `/departments` | Create new department |
| PATCH | `/departments/:id` | Update department |
| DELETE | `/departments/:id` | Delete department |

### **5. Meetings** (`/meetings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings` | List all meetings |
| GET | `/meetings/:id` | Get meeting details with minutes |
| POST | `/meetings` | Create new meeting |
| PATCH | `/meetings/:id` | Update meeting |
| DELETE | `/meetings/:id` | Delete meeting |

**Query Parameters for GET /meetings:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `meetingType` (string) - Filter by type
- `departmentId` (number) - Filter by department
- `startDate` (date) - Filter from date
- `endDate` (date) - Filter to date

### **6. Minutes** (`/minutes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/minutes` | List all minutes |
| GET | `/minutes/:id` | Get minute details |
| POST | `/minutes` | Create new minute |
| PATCH | `/minutes/:id` | Update minute |
| DELETE | `/minutes/:id` | Delete minute |
| POST | `/minutes/:id/replies` | Submit reply to minute |
| GET | `/minutes/:id/replies` | Get all replies for a minute |

### **7. Directives** (`/directives`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/directives` | List all directives |
| GET | `/directives/:id` | Get directive details |
| POST | `/directives` | Create new directive |
| PATCH | `/directives/:id` | Update directive |
| DELETE | `/directives/:id` | Delete directive |
| POST | `/directives/:id/responses` | Submit response to directive |

### **8. Announcements** (`/announcements`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/announcements` | List all announcements |
| GET | `/announcements/:id` | Get announcement with details |
| POST | `/announcements` | Create new announcement |
| PATCH | `/announcements/:id` | Update announcement |
| DELETE | `/announcements/:id` | Delete announcement |
| POST | `/announcements/:id/details/:detailId/responses` | Submit response to detail |

### **9. Complaints** (`/complaints`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/complaints` | List all complaints |
| GET | `/complaints/:id` | Get complaint details |
| POST | `/complaints` | Register new complaint |
| PATCH | `/complaints/:id` | Update complaint |
| DELETE | `/complaints/:id` | Delete complaint |
| POST | `/complaints/:id/responses` | Submit department response |

### **10. Boards** (`/boards`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/boards` | List all boards |
| GET | `/boards/:id` | Get board details |
| POST | `/boards` | Create new board |
| PATCH | `/boards/:id` | Update board |
| GET | `/boards/:id/members` | Get board members |
| POST | `/boards/:id/members` | Add board member |
| GET | `/boards/:id/meetings` | Get board meetings |
| POST | `/boards/:id/meetings` | Create board meeting |
| GET | `/boards/:id/acts` | Get board acts |
| POST | `/boards/:id/acts` | Create board act |

### **11. Tasks** (`/tasks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get task details |
| POST | `/tasks` | Create new task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/comments` | Add comment to task |
| POST | `/tasks/:id/assign` | Assign task to user/department |

### **12. KPI** (`/kpis`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/kpis` | List all KPIs |
| GET | `/kpis/:id` | Get KPI details |
| POST | `/kpis` | Create new KPI |
| PATCH | `/kpis/:id` | Update KPI |
| GET | `/kpis/:id/data` | Get KPI data entries |
| POST | `/kpis/:id/data` | Submit KPI data |

### **13. CM Remarks** (`/cm-remarks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cm-remarks` | List all CM remarks |
| GET | `/cm-remarks/:id` | Get CM remark details |
| POST | `/cm-remarks` | Create new CM remark |
| PATCH | `/cm-remarks/:id` | Update CM remark |
| DELETE | `/cm-remarks/:id` | Delete CM remark |
| POST | `/cm-remarks/:id/archive` | Archive CM remark |

### **14. Public Days** (`/public-days`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/public-days` | List all public days |
| GET | `/public-days/:id` | Get public day details |
| POST | `/public-days` | Record new public day |
| PATCH | `/public-days/:id` | Update public day record |
| GET | `/public-days/stats` | Get public days statistics |

### **15. Candidates** (`/candidates`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates` | List all candidates (MNA/MPA) |
| GET | `/candidates/:id` | Get candidate details |
| POST | `/candidates` | Add new candidate |
| PATCH | `/candidates/:id` | Update candidate |
| GET | `/candidates/constituencies` | Get all constituencies |

### **16. Letters** (`/letters`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/letters` | List all letters |
| GET | `/letters/:id` | Get letter details |
| POST | `/letters` | Create new letter |
| PATCH | `/letters/:id` | Update letter |
| POST | `/letters/:id/send` | Mark letter as sent |
| GET | `/letters/:id/generate-pdf` | Generate PDF of letter |

### **17. Sectorial Meetings** (`/sectorial-meetings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sectorial-meetings` | List sectorial meetings |
| GET | `/sectorial-meetings/:id` | Get meeting details |
| POST | `/sectorial-meetings` | Create sectorial meeting |
| PATCH | `/sectorial-meetings/:id` | Update meeting |

### **18. Senate Meetings** (`/senate-meetings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/senate-meetings` | List senate meetings |
| GET | `/senate-meetings/:id` | Get meeting details |
| POST | `/senate-meetings` | Create senate meeting |
| PATCH | `/senate-meetings/:id` | Update meeting |

### **19. Reports & Analytics** (`/reports`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/dashboard` | Dashboard summary statistics |
| GET | `/reports/meetings/summary` | Meetings summary report |
| GET | `/reports/minutes/status-summary` | Minutes status breakdown |
| GET | `/reports/departments/performance` | Department performance metrics |
| GET | `/reports/compliance/directives` | Directives compliance report |
| GET | `/reports/compliance/timelines` | Timeline compliance report |
| GET | `/reports/tasks/overview` | Tasks overview |
| GET | `/reports/complaints/stats` | Complaints statistics |
| GET | `/reports/kpi/summary` | KPI summary |
| GET | `/reports/schemes/financial-summary` | Schemes financial summary |
| GET | `/reports/schemes/progress` | Schemes progress report |
| GET | `/reports/ptf/issues-summary` | PTF issues summary |
| GET | `/reports/export/meetings` | Export meetings (PDF/Excel) |
| GET | `/reports/export/minutes` | Export minutes (PDF/Excel) |
| GET | `/reports/analytics/trends` | Decision tracking trends |
| GET | `/reports/analytics/heatmap` | Activity heatmap |

---

## 📝 **Common Query Parameters**

### **Pagination**
```
?page=1&limit=10
```

### **Sorting**
```
?sortBy=createdAt&order=DESC
```

### **Filtering**
```
?keyword=search_term
?departmentId=1
?status=pending
?startDate=2025-01-01
?endDate=2025-01-31
```

---

## 📋 **Response Format**

### **Success Response**
```json
{
  "data": { ... },
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### **Error Response**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## 🔒 **Permissions Required**

Each endpoint requires specific permissions. Check user's permissions before making requests.

**Example Permissions:**
- `meeting.create` - Create meetings
- `minute.reply` - Reply to minutes
- `user.delete` - Delete users
- `report.view` - View reports

---

## 📊 **Rate Limiting**

- **Default:** 100 requests per minute
- **Authentication:** 10 login attempts per 15 minutes

---

## 🌐 **CORS**

Allowed origins configured in environment:
- Development: `http://localhost:3000`
- Production: `https://cmdms.gov.pk`

---

**For complete, interactive API documentation, visit:**
**http://localhost:3000/api/docs**

*Last Updated: December 2025*

