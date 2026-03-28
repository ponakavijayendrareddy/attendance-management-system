def test_login_success(client, seeded_users):
    response = client.post(
        "/auth/login",
        json={"email": seeded_users["student"].email, "password": "password123"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user"]["role"] == "Student"
    assert body["access_token"]
    assert body["refresh_token"]


def test_login_failure_returns_structured_error(client, seeded_users):
    response = client.post(
        "/auth/login",
        json={"email": seeded_users["student"].email, "password": "wrongpass"},
    )

    assert response.status_code == 401
    assert response.json()["error_code"] == "auth_invalid_credentials"


def test_refresh_token_success(client, seeded_users):
    login_response = client.post(
        "/auth/login",
        json={"email": seeded_users["student"].email, "password": "password123"},
    )

    response = client.post(
        "/auth/refresh",
        json={"refresh_token": login_response.json()["refresh_token"]},
    )

    assert response.status_code == 200
    assert response.json()["access_token"]


def test_register_success(client):
    response = client.post(
        "/auth/register",
        json={
            "name": "New Student",
            "email": "newstudent@gmail.com",
            "enrollment_no": "STU9999",
            "role": "Student",
            "password": "password123",
        },
    )

    assert response.status_code == 200
    assert response.json()["user"]["email"] == "newstudent@gmail.com"
