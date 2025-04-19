import path from "path";

export enum Routes {
  Login = "login",
  Home = "home",
  NotFound = "*",
  Emails = "emails",
  NewEmail = "emails/newEmail",
  SMS = "sms",
  SMSNew = "sms/newSms",
  Groups = "groups",
  NewGroup = "groups/newGroup",
  Settings = "settings",
  Template = "template",
  TemplateNew = "template/newTemplate",
  EditTemplate = "template/editTemplate",
  Logs = "logs",
}

export const RoutesToIgnoreMenu = [Routes.Login, Routes.NotFound];

export const menuItems = [
  {
    title: "Dashboard",
    src: Routes.Home,
    path: `/${Routes.Home}`,
  },
  { title: "Logs", 
    src: Routes.Logs, 
    path: `/${Routes.Logs}` 
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
  {
    title: "Grupos",
    src: Routes.Groups,
    path: `/${Routes.Groups}`,
  },
  {
    title: "Plantillas",
    src: Routes.Template,
    path: `/${Routes.Template}`,
  },
  {
    title: "Ajustes",
    src: Routes.Settings,
    path: `/${Routes.Settings}`,
  },
];

export const API_URL = "http://localhost:3030";
