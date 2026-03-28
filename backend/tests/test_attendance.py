def test_get_student_attendance_grid(client, seeded_users, attendance_seed, access_headers):
    response = client.get(
        f"/attendance/student/{seeded_users['student'].id}?month=2026-03",
        headers=access_headers(seeded_users["student"].id),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["month"] == "2026-03"
    march_27 = next(day for day in body["days"] if day["date"] == "2026-03-27")
    assert len(march_27["slots"]) == 5
    assert march_27["slots"][0]["status"] == "Present"
    assert march_27["slots"][2]["status"] == "Pending"


def test_faculty_can_bulk_mark_attendance(client, seeded_users, access_headers):
    payload = [
        {"student_id": seeded_users["student"].id, "date": "2026-03-27", "slot": 1, "status": "Present"},
        {"student_id": seeded_users["student"].id, "date": "2026-03-27", "slot": 2, "status": "Absent"},
    ]
    response = client.post(
        "/attendance/mark",
        json=payload,
        headers=access_headers(seeded_users["faculty"].id),
    )

    assert response.status_code == 200
    assert response.json() == {"success": True, "updated_count": 2}


def test_student_cannot_mark_attendance(client, seeded_users, access_headers):
    payload = [
        {"student_id": seeded_users["student"].id, "date": "2026-03-27", "slot": 1, "status": "Present"}
    ]
    response = client.post(
        "/attendance/mark",
        json=payload,
        headers=access_headers(seeded_users["student"].id),
    )

    assert response.status_code == 403
    assert response.json()["error_code"] == "faculty_role_required"


def test_faculty_students_returns_percentages(client, seeded_users, attendance_seed, access_headers):
    response = client.get(
        "/faculty/students",
        headers=access_headers(seeded_users["faculty"].id),
    )

    assert response.status_code == 200
    students = response.json()
    assert students[0]["attendance_percentage"] >= 0
