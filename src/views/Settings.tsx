import React, { useState } from "react";
import Layout from "../components/Layout";
import { FaUserCircle, FaKey, FaEnvelope, FaPhone } from "react-icons/fa";
import ChangePassModal from "../components/Modal/Settings/ChangePassModal";

const Settings = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
  });

  const [emails] = useState(["correo1@example.com", "correo2@example.com"]);
  const [phones] = useState(["+123456789", "+987654321"]);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password: string) => {
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleChangePassword = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Simula una llamada a la API para cambiar la contraseña
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert("Contraseña actualizada correctamente.");
        setIsPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
      } else {
        throw new Error("No se pudo cambiar la contraseña.");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setPasswordError(
        "Hubo un error al cambiar la contraseña. Inténtalo de nuevo."
      );
    }
  };

  return (
    <Layout title="Configuración">
      <div
        className="w-full flex bg-gray-100 gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 6rem)" }}
      >
        {/* COLUMNA 1: Información del usuario */}
        <div className="w-6/12 flex h-72 flex-col rounded-md bg-white shadow-lg p-6 gap-6">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-4xl text-blue-500" />
            <h1 className="text-xl font-bold text-gray-700">
              Información del Usuario
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-gray-600">
              <strong>Nombre:</strong> {userInfo.name}
            </p>
            <p className="text-gray-600">
              <strong>Correo:</strong> {userInfo.email}
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <FaKey />
            Cambiar Contraseña
          </button>
        </div>

        {/* COLUMNA 2: Correos y teléfonos */}
        <div className="w-6/12 h-full flex flex-col gap-6">
          {/* Correos electrónicos */}
          <div className="w-full flex flex-col bg-white rounded-md shadow-lg p-6 gap-4">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-2xl text-green-500" />
              <h2 className="text-lg font-semibold text-gray-700">
                Correos Electrónicos
              </h2>
            </div>
            <ul className="list-disc list-inside text-gray-600">
              {emails.map((email, index) => (
                <li key={index} className="text-sm">
                  {email}
                </li>
              ))}
            </ul>
          </div>

          {/* Teléfonos */}
          <div className="w-full flex flex-col bg-white rounded-md shadow-lg p-6 gap-4">
            <div className="flex items-center gap-4">
              <FaPhone className="text-2xl text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-700">Teléfonos</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600">
              {phones.map((phone, index) => (
                <li key={index} className="text-sm">
                  {phone}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal para cambiar contraseña */}
      {isPasswordModalOpen && (
        <ChangePassModal
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          passwordError={passwordError}
          onClose={() => setIsPasswordModalOpen(false)}
          onConfirm={handleChangePassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
        />
      )}
    </Layout>
  );
};

export default Settings;
