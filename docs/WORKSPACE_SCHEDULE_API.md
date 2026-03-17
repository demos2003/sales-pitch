# Workspace Schedule API (Backend)

The frontend expects the following REST API for **per-workspace (per-project) schedule events**. Implement these on your backend so the Workspace Schedule calendar works with persistence.

## Base path

All routes are scoped by `projectId` (the workspace/project id):

- Base: `GET/POST /api/workspace/:projectId/schedule`
- Single event: `PATCH/DELETE /api/workspace/:projectId/schedule/:eventId`

## Endpoints

### GET `/api/workspace/:projectId/schedule`

Returns all schedule events for the project.

**Response:** `200 OK`

```json
[
  {
    "_id": "event-id",
    "projectId": "project-id",
    "title": "Sprint planning",
    "start": "2025-03-15T09:00:00.000Z",
    "end": "2025-03-15T10:00:00.000Z",
    "allDay": false,
    "description": "Optional notes",
    "isMeeting": true,
    "meetingLink": "https://zoom.us/j/...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### POST `/api/workspace/:projectId/schedule`

Create a new event.

**Body:**

```json
{
  "title": "Meeting",
  "start": "2025-03-15T09:00:00.000Z",
  "end": "2025-03-15T10:00:00.000Z",
  "allDay": false,
  "description": "Optional",
  "isMeeting": true,
  "meetingLink": "https://meet.google.com/..."
}
```

**Response:** `201 Created` – same object with `_id`, `createdAt`, `updatedAt`.

### PATCH `/api/workspace/:projectId/schedule/:eventId`

Update an existing event. Body can contain any of: `title`, `start`, `end`, `allDay`, `description`, `isMeeting`, `meetingLink`.

**Response:** `200 OK` – updated event object.

### DELETE `/api/workspace/:projectId/schedule/:eventId`

Delete an event.

**Response:** `204 No Content` or `200 OK`.

## Auth

Use the same auth as the rest of the API (e.g. `Authorization: Bearer <token>`). Only members of the project/workspace should be allowed to read/write schedule events for that project.
