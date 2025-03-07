import { Navigate, Route, Routes, useLocation } from "react-router";
import useSession from "./customHooks/useSession";
import Login from "./views/Login";
import Home from "./views/Home";
import Sidebar from "./components/Sidebar";
import NotFound from "./views/NotFound";
import { menuItems, RoutesToIgnoreMenu } from "./data/constants";

const App = () => {
  const sessionData = useSession();
  const location = useLocation();

  // if (!sessionData.user.name || !sessionData.user.email || !sessionData.token) {

  //   if (location.pathname !== "/login") {
  //     return <Navigate to="login" />;
  //   }
  // }

  return (
    <div className="flex ">
      {!RoutesToIgnoreMenu.includes(location.pathname as any) && (
        <Sidebar menus={menuItems} />
      )}

      <div className="h-screen flex-1 ">
        <Routes>
          <Route path={"login"} element={<Login />} />
          <Route path={"home"} element={<Home />} />
          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
