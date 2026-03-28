import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { FacultyDashboardPage } from "./pages/FacultyDashboardPage";
import { HomeDashboardPage } from "./pages/HomeDashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomeDashboardPage />} />
        <Route path="/student" element={<StudentDashboardPage />} />
        <Route path="/faculty" element={<FacultyDashboardPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
