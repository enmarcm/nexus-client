// filepath: c:\Users\theen\Desktop\nexus-front\src\context\session.tsx
import { createContext, useState, ReactNode } from "react";

type SessionDataType = {
  user: {
    name: string | null;
    email: string | null;
  };
  token: string | null;
};

const SessionData: SessionDataType = {
  user: {
    name: null,
    email: null,
  },
  token: null,
};

const SessionContext = createContext<{
  sessionData: SessionDataType;
  setSessionData: React.Dispatch<React.SetStateAction<SessionDataType>>;
}>({
  sessionData: SessionData,
  setSessionData: () => {},
});

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionDataType>(SessionData);

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };