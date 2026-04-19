from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.dependencies import get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_task_manager.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_register_login_and_task_flow():
    register_response = client.post(
        "/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "test1234",
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/login",
        data={
            "username": "testuser",
            "password": "test1234",
        },
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    create_response = client.post(
        "/tasks",
        json={
            "title": "Test Task",
            "description": "Test Description",
        },
        headers=headers,
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    get_tasks_response = client.get("/tasks", headers=headers)
    assert get_tasks_response.status_code == 200
    assert len(get_tasks_response.json()) == 1

    get_task_response = client.get(f"/tasks/{task_id}", headers=headers)
    assert get_task_response.status_code == 200

    update_response = client.put(
        f"/tasks/{task_id}",
        json={"completed": True},
        headers=headers,
    )
    assert update_response.status_code == 200
    assert update_response.json()["completed"] is True

    delete_response = client.delete(f"/tasks/{task_id}", headers=headers)
    assert delete_response.status_code == 204
