import React from "react";

interface ChangePassModalProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  onClose: () => void;
  onConfirm: () => void;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
}

const ChangePassModal: React.FC<ChangePassModalProps> = ({
  currentPassword,
  newPassword,
  confirmPassword,
  passwordError,
  onClose,
  onConfirm,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[400px] rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Cambiar Contraseña
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>
        <div className="flex justify-between gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-[#FF69B4] text-white rounded-md hover:bg-pink-600 transition"
            onClick={onConfirm}
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassModal;
