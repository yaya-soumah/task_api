# TaskAPI - My Task Thing

This is a **Task Tracker API** built with Django to mess with tasks—regular ones and urgent ones that have sub-tasks and dependencies. 

## What’s It Got?
- Tasks—regular or urgent with extra stuff like dependencies.
- Sub-tasks that stack up with a depth thing to track.
- API to add, change, or delete tasks.
- React mockup—shows tasks all fancy-like in a tree view.

## Tech Stack
- Django and some REST bits
- PostgreSQL for data
- Celery and Redis for slow stuff
- React.js (just this once)
- Render (free tier pain)

## Setup
1. Grab it: `git clone https://github.com/yaya-soumah/task_api.git`
2. Stick keys in `.env`—database, Redis, secret stuff.
3. Install: `pip install -r requirements.txt`
4. Migrate: `python manage.py migrate`
5. Run: `python manage.py runserver` + `celery -A task_api worker -l info`

## Usage
- Get token: `POST http://localhost:8000/v1/api/token/` with `{"username": "you", "password": "pass"}`.
- List tasks: `GET http://localhost:8000/v1/api/urgent-tasks/` or `/api/v1/regular-tasks/` with `Authorization: Bearer your_token`.
- Filter: Add `?priority=3` or `?tag=work`.
- Add task: `POST /api/v1/urgent-tasks/` with `{"title": "Fix Stuff", "priority": 3, "tags": ["work"]}`.
- Update: `PUT /api/v1/urgent-tasks/` with `{"id": 1, "completed": true}`.
- Progress: `GET /api/v1/urgent-tasks/1/progress/`.
- Admin: `http://localhost:8000/admin/` (username/password).
- React mockup: `cd frontend && npm install && npm run dev`.

## React Mockup
My React mockup’s a dashboard—urgent tasks red (priority 3+), regular blue, sub-tasks nested by depth. Filter by priority or tag, add tasks, click for comments, deadlines, or progress (like 60% done). It hits my API’s `/urgent/`, `/regular/`, and `/task_progress/` endpoints to show what’s up—backend’s still my jam. Check it:  
![TaskAPI Mockup](frontend/screenshot.png)

Yaya Soumah made this. More at [github.com/yaya-soumah](https://github.com/yaya-soumah).