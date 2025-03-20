import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import "./css/Login.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import useSession from "../customHooks/useSession";
import useFetcho from "../customHooks/useFetcho";

const Login = () => {
  const navigate = useNavigate();
  const { createSession, sessionData, checkTokenAndSetSession} = useSession();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showErrorText, setShowErrorText] = useState(false);
  const [isMissingData, setIsMissingData] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  useEffect(() => {
    const data = checkTokenAndSetSession() as any;

    console.log("Session data:", sessionData);
    
    if (data?.user.name && data?.user.email && data?.token) {
        navigate("/home");
    }
  }, []);

  const fetchWithLoading = useFetcho();

  const handleLogin = async () => {
    if (!email || !password) {
      setIsMissingData(true);
      setTimeout(() => setIsMissingData(false), 500);
      return;
    }

    const data = (await fetchWithLoading({
      url: "http://localhost:3030/login",
      method: "POST",
      body: { email, password },
      isCors: true,
    })) as any;

    if (data && data.token) {
      createSession(data.token, {
        name: data.name,
        email: data.email,
        profile: data.profile,
        id: data.id,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }, 300);
    } else {
      setIsError(true);
      setTimeout(() => setShowErrorText(true), 600);
      setTimeout(() => {
        setIsError(false);
        setShowErrorText(false);
      }, 1500);
    }
  };

  return (
    <section
      className={`w-full h-screen flex justify-center items-center bg-backgroundWhite ${
        isAnimating ? "transition-style-out-top-wipe" : ""
      }`}
    >
      <div
        className={`relative grid grid-cols-1 md:grid-cols-30-60 bg-white p-6 md:p-20 rounded-xl shadow-sm gap-6 md:min-h-96 justify-center w-full md:w-2/3 m-4 md:m-0 ${
          isSuccess
            ? "transition-success"
            : isError
            ? "transition-error-container"
            : ""
        } ${isMissingData ? "animate-shake" : ""}`}
      >
        {isSuccess ? (
          <div className="flex justify-center items-center w-full h-full">
            <FaCheck className="text-green-500 text-6xl" />
          </div>
        ) : isError ? (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <FaTimes className="text-red-500 text-6xl transition-error-icon" />
            {showErrorText && (
              <p className="text-red-500 mt-4 transition-error-text">
                Error: Credenciales incorrectas
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-4 md:items-start md:justify-start justify-center items-center min-h-full">
              <img src="Nexus.svg" alt="Logo Nexus" className="h-14 w-24" />
              <h2 className="font-bold text-4xl">Iniciar sesión</h2>
              <p>Para acceder a Nexus</p>
            </div>
            <div className="flex flex-col justify-end items-end w-full">
              <div className="flex flex-col gap-4 w-full md:w-10/12">
                <Input
                  label="Correo electrónico"
                  type="email"
                  id="43"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Contraseña"
                  type="password"
                  id="44"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button content="Ingresar" onClick={handleLogin} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Login;
