import React, { useState } from "react";
import { Input as InputD } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface InputProps {
  value?: string;
  background?: string;
  label?: string;
  type?: "text" | "email" | "password";
  id?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  background = "#F1F4FA",
  label,
  type = "text",
  id,
  placeholder,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "email" && emailTouched) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailInvalid(!emailRegex.test(e.target.value));
    }

    if (onChange) {
      onChange(e);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailInvalid(!emailRegex.test(value));
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 font-semibold"
          style={{ color: isEmailInvalid ? "red" : "inherit" }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <InputD
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          placeholder={placeholder}
          style={{
            background: background,
            borderRadius: "0.5rem",
          }}
          className={`w-full px-2 py-3 border ${
            isEmailInvalid ? "border-red-500" : "border-gray-300"
          } 
                      hover:border-[#3A36DB] hover:shadow-[#3A36DB] focus:outline-none focus:shadow-[#3A36DB] active:outline-none`}
                      
          onChange={handleInputChange}
          onBlur={type === "email" ? handleEmailBlur : undefined}
        />
        {type === "password" && (
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        )}
        {isEmailInvalid && type === "email" && (
          <p className="text-red-500 text-sm mt-1">
            Correo electrónico inválido.
          </p>
        )}
      </div>
    </div>
  );
};
