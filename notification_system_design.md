# Campus Notifications Microservice

# Stage 1 – API Design

## Core Actions

* Create Notification
* Get Notifications
* Get Unread Notifications
* Mark Notification as Read
* Mark All Notifications as Read
* Delete Notification

---

## Create Notification

POST /api/v1/notifications

Headers:
Authorization: Bearer Token
Content-Type: application/json

Request:

```json
{
  "studentId": 1042,
  "type": "Placement",
  "message": "Microsoft Internship Applications Open"
}
```

Response:

```json
{
  "success": true,
  "message": "Notification created successfully"
}
```

---

## Get Notifications

GET /api/v1/notifications

Headers:
Authorization: Bearer Token

Response:

```json
[
  {
    "id": 1,
    "studentId": 1042,
    "type": "Placement",
    "message": "Microsoft Internship Applications Open",
    "isRead": false,
    "createdAt": "2026-06-18T12:00:00Z"
  }
]
```

---

## Get Unread Notifications

GET /api/v1/notifications/unread

---

## Mark Notification Read

PATCH /api/v1/notifications/{id}/read

Response:

```json
{
  "success": true
}
```

---

## Mark All Read

PATCH /api/v1/notifications/read-all

---

## Delete Notification

DELETE /api/v1/notifications/{id}

Response:

```json
{
  "success": true
}
```

---

## Real-Time Notifications

Architecture:

Student Browser/App
↓
WebSocket Gateway
↓
Notification Service
↓
Database

WebSockets are preferred over polling because they provide low latency and reduce unnecessary database requests.

---

# Stage 2 – Storage Design

Database: PostgreSQL

## Students Table

```sql
CREATE TABLE students(
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255)
);
```

## Notifications Table

```sql
CREATE TABLE notifications(
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    type VARCHAR(30),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Indexes:

```sql
CREATE INDEX idx_student
ON notifications(student_id);

CREATE INDEX idx_student_read
ON notifications(student_id,is_read);

CREATE INDEX idx_created
ON notifications(created_at);

CREATE INDEX idx_type
ON notifications(type);
```

Scaling Issues:

* Notifications table grows rapidly.
* Read queries become slower.
* Storage requirements increase.

Solutions:

* Partition tables by month.
* Archive old notifications.
* Add indexes for frequent queries.
* Use Redis cache.

---

# Stage 3 – Query Optimization

Current Query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

Why Slow:

* Full table scan.
* Sorting millions of rows.
* No composite index.

Optimized Index:

```sql
CREATE INDEX idx_notifications
ON notifications(
    studentID,
    isRead,
    createdAt DESC
);
```

Complexity:
Without index → O(N)

With index → approximately O(log N)

Adding indexes on every column is not recommended because:

* Slower inserts
* Higher storage usage
* Increased maintenance cost

Placement Notifications in Last 7 Days:

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4 – Performance Improvements

Problems:

* Notifications fetched on every page load.
* Database receives excessive requests.

Solutions:

1. Redis Cache
2. Pagination
3. Infinite Scrolling
4. WebSocket Push Notifications

Trade-Offs:

* Cache requires invalidation strategy.
* WebSockets consume server memory.
* Pagination increases API complexity.

---

# Stage 5 – Notify All (50,000 Students)

Current Implementation:

```text
for each student:
    send_email()
    save_to_db()
    push_to_app()
```

Problems:

* Sequential execution
* Very slow
* No retry mechanism
* Partial failures possible
* Poor scalability

Proposed Architecture:

HR Portal
↓
Notification Service
↓
Message Queue
↓
Workers
├── Email Worker
├── Database Worker
└── Push Worker

Technology:
RabbitMQ or Kafka

Improved Flow:

1. Create notification event.
2. Publish to queue.
3. Workers process tasks independently.
4. Failed tasks are retried.
5. Dead-letter queue stores permanently failed tasks.

Benefits:

* Parallel execution
* Fault tolerance
* Retry support
* Horizontal scalability
* Faster notification delivery

```
```
