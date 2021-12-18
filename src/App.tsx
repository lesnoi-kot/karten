import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import routes, { defaultRoute, Route as RouteMeta } from "configs/routes";
import Page from "pages/Page";

function generateRoutes(routes: RouteMeta[]) {
  return routes.map((route) => {
    const children = route.childrens ? generateRoutes(route.childrens) : null;

    return (
      <Route key={route.name} path={route.path} element={<route.component />}>
        {children}
      </Route>
    );
  });
}

function App() {
  return (
    <Routes>
      <Route element={<Page />}>
        {generateRoutes(routes)}
        <Route index element={<defaultRoute.component />} />
        <Route path="*" element={<Navigate to={defaultRoute.path} />} />
      </Route>
    </Routes>
  );
}

export default App;
