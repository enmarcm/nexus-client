import React from "react";
import { Button as AntButton } from "antd";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  linkTo?: string;
  content: string;
  color?: string;
  textColor?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  linkTo,
  content,
  color = "#3A36DB",
  textColor = "#fff",
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <AntButton
      onClick={handleClick}
      style={{
        backgroundColor: color,
        color: textColor,
        borderRadius: "0.5rem",
        border: "none",
      }}
      className="px-2 py-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:brightness-90"
    >
      {content}
    </AntButton>
  );
};
