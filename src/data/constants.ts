import { title } from "process";

export enum Routes {
  Login = "login",
  Home = "home",
  NotFound = "*",
  Emails = "emails",
  NewEmail = "emails/newEmail",
  SMS = "sms",
  SMSNew = "sms/newSms",
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
  {
    title: "Mensajes",
    src: Routes.SMS,
    path: `/${Routes.SMS}`,
  },
];

export const API_URL = "http://localhost:3030";