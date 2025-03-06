import { Navigate, Route, Routes, useLocation } from "react-router";
import useSession from "./customHooks/useSession";
import Login from "./views/Login";
import Home from "./views/Home";

const App = () => {
  const sessionData = useSession();
  const location = useLocation();

  console.log(sessionData)

  // if (!sessionData.user.name || !sessionData.user.email || !sessionData.token) {

  //   if (location.pathname !== "/login") {
  //     return <Navigate to="login" />;
  //   }
  // }

  return (

    <Routes>
      <Route path={"login"} element={<Login />} />
      <Route path={"home"} element={<Home />} />
      <Route path={"*"} element={<div>Cualquier cosa</div>} />
    </Routes>
  );
};

export default App;
