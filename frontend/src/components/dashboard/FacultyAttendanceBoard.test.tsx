import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { FacultyAttendanceBoard } from "./FacultyAttendanceBoard";
import { AuthContextTestProvider } from "../test-utils/AuthContextTestProvider";
import { useAuthStore } from "../../store/authStore";

const server = setupServer(
  http.get("http://localhost:8000/faculty/students", () =>
    HttpResponse.json([
      {
        id: 1,
        name: "Student One",
        email: "student@gmail.com",
        enrollment_no: "STU1001",
        attendance_percentage: 70,
      },
    ]),
  ),
  http.post("http://localhost:8000/attendance/mark", () =>
    HttpResponse.json({ success: true, updated_count: 1 }),
  ),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  useAuthStore.getState().setStudents([]);
});
afterAll(() => server.close());

test("optimistically toggles a faculty slot", async () => {
  const user = userEvent.setup();
  useAuthStore.getState().setSession({
    user: { id: 99, name: "Faculty", email: "faculty@gmail.com", role: "Faculty" },
    accessToken: "token",
    refreshToken: "refresh",
  });

  render(
    <AuthContextTestProvider user={{ id: 99, name: "Faculty", email: "faculty@gmail.com", role: "Faculty" }}>
      <FacultyAttendanceBoard />
    </AuthContextTestProvider>,
  );

  const button = await screen.findByRole("button", { name: /slot 1/i });
  await user.click(button);

  await waitFor(() => expect(screen.getByText(/72.0%/i)).toBeInTheDocument());
});
