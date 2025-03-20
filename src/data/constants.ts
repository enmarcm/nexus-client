import { title } from "process";

export enum Routes {
  Login = "login",
  Home = "home",
  NotFound = "*",
  Email = "email",
}

export const RoutesToIgnoreMenu = [Routes.Login, Routes.NotFound];

export const menuItems = [
  {
    title: "Dashboard",
    src: Routes.Home,
    path: `/${Routes.Home}`,
  },
  {
    title: "Emails",
    src: Routes.Email,
    path: `/${Routes.Email}`
  }
];
