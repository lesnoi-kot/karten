import { compile } from "path-to-regexp";

import routes, { defaultRoute, Route } from "configs/routes";

export function findRoute(root: Route[], name: string): Route | null {
  for (const route of root) {
    if (route.name === name) {
      return route;
    }

    if (route.childrens) {
      const anotherRoute = findRoute(route.childrens, name);

      if (anotherRoute) {
        return { ...anotherRoute, path: route.path + "/" + anotherRoute.path };
      }
    }
  }

  return null;
}

// TODO: compute types of name from routes
export const buildURL = (name: string, params?: object) => {
  const route = findRoute(routes, name);

  if (!route) {
    return defaultRoute.path;
  }

  return compile(route.path)(params);
};
