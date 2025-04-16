export enum Routes {
  Login = "login",
  Home = "home",
  NotFound = "*",
  Emails = "emails",
}

export const RoutesToIgnoreMenu = [Routes.Login, Routes.NotFound];

export const menuItems = [
  {
    title: "Dashboard",
    src: Routes.Home,
    path: `/${Routes.Home}`,
  },
  {
    title: "Correos",
    src: Routes.Emails,
    path: `/${Routes.Emails}`,
  },
];

export const API_URL = "http://localhost:3030";