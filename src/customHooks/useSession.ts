import { useContext } from "react";
import { SessionContext } from "../context/session";

const useSession = () => {
  const { sessionData } = useContext(SessionContext);
  return sessionData;
};

export default useSession;