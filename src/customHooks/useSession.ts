import { useContext } from "react";
import { SessionContext } from "../context/session";

const useSession = () => {
  const { sessionData, setSessionData, checkTokenAndSetSession } = useContext(SessionContext);

  const createSession = (
    newToken: string,
    user: { name: string; email: string; profile: string; id: string }
  ) => {
    const newSessionData = {
      user,
      token: newToken,
    };

    localStorage.setItem("token", newToken);
    setSessionData(newSessionData);

    console.log("Session created", newSessionData);
  };

  const destroySession = () => {
    localStorage.removeItem("token");
    setSessionData({
      user: {
        name: null,
        email: null,
        profile: null,
        id: null,
      },
      token: null,
    });
  };

  return { sessionData, createSession, destroySession, checkTokenAndSetSession };
};

export default useSession;
