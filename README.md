# Task Manager Web Application

A simple full-stack Task Manager built for a Python Developer Intern assignment. The project includes a FastAPI backend with JWT authentication, SQLite database integration, and a basic frontend for registering users, logging in, and managing personal tasks.

## Features

- User registration with unique username and email
- User login with JWT-based authentication
- Password hashing with bcrypt
- Create, list, view, update, and delete tasks
- User-specific task access control
- Task filtering with `?completed=true` or `?completed=false`
- Pagination with `skip` and `limit`
- Basic frontend using HTML, CSS, and JavaScript
- Automated API test with pytest

## Tech Stack

- Backend: FastAPI
- Database: SQLite
- ORM: SQLAlchemy
- Validation: Pydantic
- Authentication: OAuth2 password flow + JWT
- Frontend: HTML, CSS, JavaScript
- Testing: pytest

## Project Structure

```text
task-manager/
  backend/
    app/
      routes/
        auth.py
        tasks.py
      auth.py
      config.py
      database.py
      dependencies.py
      main.py
      models.py
      schemas.py
  frontend/
    index.html
    script.js
    style.css
  tests/
    conftest.py
    test_main.py
  .env.example
  .gitignore
  Dockerfile
  README.md
  requirements.txt
```

## Environment Variables

Create a `.env` file in the project root using the values from `.env.example`.

```env
DATABASE_URL=sqlite:///./task_manager.db
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## How To Run Locally

1. Create and activate a virtual environment.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

2. Install dependencies.

```powershell
pip install -r requirements.txt
```

3. Create a `.env` file using `.env.example`.

4. Run the FastAPI server from the `backend` folder.

```powershell
cd backend
uvicorn app.main:app --reload
```

5. Open the API docs.

```text
http://127.0.0.1:8000/docs
```

6. Open the frontend.

Open `frontend/index.html` in the browser while the backend is running.

## API Endpoints

### Authentication

- `POST /register`
- `POST /login`

### Tasks

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{task_id}`
- `PUT /tasks/{task_id}`
- `DELETE /tasks/{task_id}`

## Running Tests

From the `backend` directory:

```powershell
pytest ..\tests -v
```

## Deployment Notes

- Keep `.env` out of version control
- Include `.env.example` in the repository
- Make sure `/docs` is publicly accessible
- Update the frontend API base URL in `frontend/script.js` to the deployed backend URL before deploying the frontend separately



## Deployment Link

Frontend: https://majestic-kashata-e07acd.netlify.app  
Live API: https://task-manager-6ras.onrender.com  
API Docs: https://task-manager-6ras.onrender.com/docs
