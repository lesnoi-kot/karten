import ProjectsPage from "pages/Projects";
import ProjectPage from "pages/Project";
import BoardPage from "pages/Board";

export type Route = {
  name: string;
  path: string;
  component: React.ComponentType;
  childrens?: Route[];
};

export const routes: Route[] = [
  {
    name: "pages:projects",
    path: "/projects",
    component: ProjectsPage,
  },
  {
    name: "pages:project",
    path: "/project/:projectId",
    component: ProjectPage,
  },
  {
    name: "pages:board",
    path: "/board/:boardId",
    component: BoardPage,
    childrens: [
      {
        name: "pages:task",
        path: ":taskId",
        component: BoardPage,
      },
    ],
  },
];

export const defaultRoute = routes[0];
export default routes;
