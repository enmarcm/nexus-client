import { createContext, useState, useEffect, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";
import { useLocation } from "react-router-dom";

type SessionDataType = {
  user: {
    name: string | null;
    email: string | null;
    profile?: string | null;
    id: string | null;
  };
  token: string | null;
};

const SessionData: SessionDataType = {
  user: {
    name: null,
    email: null,
    profile: null,
    id: null,
  },
  token: null,
};

const SessionContext = createContext<{
  sessionData: SessionDataType;
  setSessionData: React.Dispatch<React.SetStateAction<SessionDataType>>;
  checkTokenAndSetSession: () => void;
}>({
  sessionData: SessionData,
  setSessionData: () => {},
  checkTokenAndSetSession: () => {},
});

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionDataType>(SessionData);
  const location = useLocation();

  const checkTokenAndSetSession = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decodedToken: any = jwtDecode(token);
      const user = {
        name: decodedToken.name,
        email: decodedToken.email,
        profile: decodedToken.profile,
        id: decodedToken.id,
      };
      setSessionData({ user, token });
      return { user, token };
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  useEffect(() => {
    checkTokenAndSetSession();
  }, []);

  useEffect(() => {
    if (!sessionData.user.name || !sessionData.user.email || !sessionData.token) {
      checkTokenAndSetSession();
    }
  }, [location.pathname]);

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData, checkTokenAndSetSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };