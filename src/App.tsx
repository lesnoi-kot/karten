import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { settings } from "settings";

import ProjectsPage from "pages/Projects";
import ProjectPage from "pages/Project";
import BoardPage from "pages/Board";
import LandingPage from "pages/Landing";
import ProfilePage from "pages/Profile";
import { BoardMenu } from "pages/Board/BoardMenu";
import { ProjectsMenu } from "pages/Projects/ProjectsMenu";
import { ProjectMenu } from "pages/Project/ProjectMenu";
import LayoutWithNavbar from "components/layouts/LayoutWithNavbar";
import RequireAuth from "components/RequireAuth";
import { BaseMenu } from "components/Navbar/DrawerMenu";

export default function App() {
  return (
    <BrowserRouter basename={settings.baseURL}>
      <Routes>
        <Route index path="/welcome" element={<LandingPage />} />

        <Route
          element={
            <RequireAuth redirectTo="/welcome">
              <LayoutWithNavbar>
                <Routes>
                  <Route index path="/projects" element={<ProjectsMenu />} />
                  <Route path="/projects/:id" element={<ProjectMenu />} />
                  <Route path="/boards/:id" element={<BoardMenu />} />
                  <Route path="*" element={<BaseMenu />} />
                </Routes>
              </LayoutWithNavbar>
            </RequireAuth>
          }
        >
          <Route index path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/boards/:id" element={<BoardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/projects" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
