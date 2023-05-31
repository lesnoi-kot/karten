import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

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
import ErrorSplash from "components/ui/ErrorSplash";

export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <ErrorSplash message={String(error)} />}
    >
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
            <Route
              index
              path="/projects"
              element={
                <Suspense>
                  <ProjectsPage />
                </Suspense>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <Suspense>
                  <ProjectPage />
                </Suspense>
              }
            />
            <Route
              path="/boards/:id"
              element={
                <Suspense>
                  <BoardPage />
                </Suspense>
              }
            />
            <Route
              path="/profile"
              element={
                <Suspense>
                  <ProfilePage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/projects" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
