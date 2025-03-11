import { Navigate, Route, Routes, useLocation } from "react-router";
import useSession from "./customHooks/useSession";
import Login from "./views/Login";
import Home from "./views/Home";
import Sidebar from "./components/Sidebar";
import NotFound from "./views/NotFound";
import { menuItems, RoutesToIgnoreMenu, Routes as AppRoutes } from "./data/constants";

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
      {!RoutesToIgnoreMenu.includes(pathWithoutSlash as AppRoutes) && (
        <Sidebar menus={menuItems} />
      )}

      <div className="h-screen flex-1">
        <Routes>
          <Route path={AppRoutes.Login} element={<Login />} />
          <Route path={AppRoutes.Home} element={<Home />} />
          <Route path={AppRoutes.NotFound} element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;