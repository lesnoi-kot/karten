import { useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { settings } from "settings";
import { useAppDispatch } from "app/hooks";
import { actions as apiActions } from "app/apiInteraction";
import ProjectsPage from "pages/Projects";
import ProjectPage from "pages/Project";
import BoardPage from "pages/Board";
import Landing from "pages/Landing";
import { BoardMenu } from "pages/Board/BoardMenu";
import { ProjectsMenu } from "pages/Projects/ProjectsMenu";
import { ProjectMenu } from "pages/Project/ProjectMenu";
import LayoutWithNavbar from "components/layouts/LayoutWithNavbar";
import RequireAuth from "components/RequireAuth";
import { useRequest } from "app/apiInteraction/hooks";

function App() {
  const { load, isLoaded } = useRequest(apiActions.getCurrentUser);

  useEffect(load, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <BrowserRouter basename={settings.baseURL}>
      <Routes>
        <Route index path="/welcome" element={<Landing />} />

        <Route
          element={
            <RequireAuth redirectTo="/welcome">
              <LayoutWithNavbar>
                <Routes>
                  <Route index path="/projects" element={<ProjectsMenu />} />
                  <Route path="/projects/:id" element={<ProjectMenu />} />
                  <Route path="/boards/:id" element={<BoardMenu />} />
                </Routes>
              </LayoutWithNavbar>
            </RequireAuth>
          }
        >
          <Route index path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/boards/:id" element={<BoardPage />} />
          <Route path="*" element={<Navigate to="/projects" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
