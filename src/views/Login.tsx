import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import './css/Login.css'; 
import { FaCheck } from "react-icons/fa"; 

const Login = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        navigate("/home"); 
      }, 1500); 
    }, 300); 
  };

  return (
    <section className={`w-full h-screen flex justify-center items-center bg-backgroundWhite ${isAnimating ? "transition-style-out-top-wipe" : ""}`}>
      <div className={`grid grid-cols-1 md:grid-cols-30-60 bg-white p-6 md:p-20 rounded-xl shadow-sm gap-6 md:min-h-96 justify-center w-full md:w-2/3 m-4 md:m-0 ${isSuccess ? "transition-success" : ""}`}>
        {isSuccess ? (
          <div className="flex justify-center items-center w-full h-full">
            <FaCheck className="text-green-500 text-6xl" />
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
                <Input label="Correo electrónico" type="email" id="43" />
                <Input label="Contraseña" type="password" id="44" />
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