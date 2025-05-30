import { Navigate, Route, Routes, useLocation } from "react-router";
import useSession from "./customHooks/useSession";
import Login from "./views/Login";
import Home from "./views/Home";
import Emails from "./views/Email";
import Sidebar from "./components/Sidebar";
import NotFound from "./views/NotFound";
import { menuItems, RoutesToIgnoreMenu, Routes as AppRoutes } from "./data/constants";
import Mail from "./views/Mail";
import NewEmail from "./views/NewEmail";
import SMS from "./views/SMS";
import NewSms from "./views/NewSms";
import Groups from "./views/Groups";
import Templates from "./views/Templates";
import NewTemplate from "./views/NewTemplate";
import EditTemplate from "./views/EditTemplate";
import Settings from "./views/Settings";
import LogControl from "./views/LogControl";
import Loader from "./components/Loader"; // Importar el componente Loader

const App = () => {
  const { sessionData } = useSession();
  const location = useLocation();

  if (!sessionData.user.name || !sessionData.user.email || !sessionData.token) {
    if (location.pathname !== `/${AppRoutes.Login}`) {
      return <Navigate to={`/${AppRoutes.Login}`} />;
    }
  }

  const pathWithoutSlash = location.pathname.replace("/", "");

  return (
    <div className="flex max-w-full overflow-x-hidden">
      <Loader /> 

      {!RoutesToIgnoreMenu.includes(pathWithoutSlash as AppRoutes) && (
        <div className="sticky top-0 h-screen">
          <Sidebar menus={menuItems} />
        </div>
      )}

      <div className="h-screen flex-1 overflow-x-hidden">
        <Routes>
          <Route path={AppRoutes.Login} element={<Login />} />
          <Route path={AppRoutes.Home} element={<Home />} />
          <Route path={AppRoutes.NotFound} element={<NotFound />} />
          <Route path={AppRoutes.Emails} element={<Mail />} />
          <Route path={AppRoutes.NewEmail} element={<NewEmail />} />
          <Route path={AppRoutes.SMS} element={<SMS />} />
          <Route path={AppRoutes.Logs} element={<LogControl />} />
          <Route path={AppRoutes.SMSNew} element={<NewSms />} />
          <Route path={AppRoutes.Groups} element={<Groups />} />
          <Route path={AppRoutes.Template} element={<Templates />} />
          <Route path={AppRoutes.TemplateNew} element={<NewTemplate />} />
          <Route path={AppRoutes.EditTemplate} element={<EditTemplate />} />
          <Route path={AppRoutes.Settings} element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;