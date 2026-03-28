def test_student_cannot_access_peer_attendance(client, seeded_users, access_headers):
    response = client.get(
        f"/attendance/student/{seeded_users['peer'].id}?month=2026-03",
        headers=access_headers(seeded_users["student"].id),
    )

    assert response.status_code == 403
    assert response.json()["error_code"] == "attendance_forbidden"


def test_missing_token_returns_401(client, seeded_users):
    response = client.get(f"/attendance/student/{seeded_users['student'].id}?month=2026-03")

    assert response.status_code == 401
    assert response.json()["error_code"] == "auth_credentials_missing"
