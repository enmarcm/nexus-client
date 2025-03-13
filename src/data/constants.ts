export enum Routes {
  Login = "login",
  Home = "home",
  NotFound = "*",
}

export const RoutesToIgnoreMenu = [Routes.Login, Routes.NotFound];

export const menuItems = [
  {
    title: "Dashboard",
    src: Routes.Home,
    path: `/${Routes.Home}`,
  },
];
