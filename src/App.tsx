import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { settings } from "settings";

import LayoutWithNavbar from "components/layouts/LayoutWithNavbar";
import ProjectsPage from "pages/Projects";
import ProjectPage from "pages/Project";
import BoardPage from "pages/Board";
import { BoardMenu } from "pages/Board/BoardMenu";
import { ProjectsMenu } from "pages/Projects/ProjectsMenu";

function App() {
  return (
    <BrowserRouter basename={settings.publicURL}>
      <Routes>
        <Route index path="/welcome" element={<div>Fancy landing</div>} />

        <Route
          element={
            <LayoutWithNavbar>
              <Routes>
                <Route index path="/projects" element={<ProjectsMenu />} />
                <Route path="/projects/:id" element={<div>Project menu</div>} />
                <Route path="/boards/:id" element={<BoardMenu />} />
              </Routes>
            </LayoutWithNavbar>
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
