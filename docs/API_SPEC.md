# Lumiere API Specification

Base URL: `/api/v1`

---

## AUTH MODULE
| Method | Endpoint | Description |
|--------|-----------|--------------|
| POST | /auth/register | Create new user |
| POST | /auth/login | Login and get token |
| GET | /auth/me | Get current user info |

Response Example:
```json
{
  "id": 1,
  "username": "james",
  "email": "james@example.com",
  "plan": "premium"
}
```

---

## ADMIN MODULE
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /admin/metrics | Get system overview stats |

Response Example:
```json
{
  "total_users": 120,
  "total_queries": 3050,
  "total_messages": 880,
  "active_data_sources": 45,
  "total_costs": 520.75
}
```

---

## DATA MODULE
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /data/upload | Upload CSV file |
| GET | /data/sources | List connected data sources |
| DELETE | /data/source/{id} | Delete data source |

---

## AI MODULE
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /ai/query | Generate SQL from user question |
| POST | /ai/chart | Generate chart from SQL data |
| POST | /ai/insight | Generate insights summary |

---

## USER MODULE
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /users/{id} | Get user profile |
| PATCH | /users/{id} | Update user info |
