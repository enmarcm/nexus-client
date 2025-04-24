import React, { useState, useEffect } from "react";

const TextEdit = ({
  editorType,
  content,
  setContent,
  setVariables,
}: {
  editorType: "html" | "text";
  content: any;
  setContent: (value: string) => void;
  setVariables: (variables: string[]) => void;
}) => {
  console.log("content", content);
  console.log("editorType", editorType);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (editorType === "html") {
      const { key } = e;
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd } = textarea;

      // Permitir tabulaciones
      if (key === "Tab") {
        e.preventDefault();
        const before = content.slice(0, selectionStart);
        const after = content.slice(selectionEnd);
        const tab = "  "; // Dos espacios como tabulación
        setContent(`${before}${tab}${after}`);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + tab.length;
        }, 0);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Detectar variables en el contenido
    const variableRegex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    const matches = [...newContent.matchAll(variableRegex)];
    const variables = matches.map((match) => match[1]); // Extraer los nombres de las variables
    setVariables(variables);
  };

  return (
    <div className="w-full flex-grow border border-gray-300 rounded-md overflow-hidden">
      <textarea
        className={`w-full h-full p-4 border-none outline-none resize-none ${
          editorType === "html"
            ? "bg-gray-900 text-green-400 font-mono"
            : "bg-white text-gray-700"
        }`}
        placeholder={
          editorType === "html"
            ? "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Nuevo Correo</title>\n  </head>\n  <body>\n    <!-- Escribe tu código HTML aquí -->\n  </body>\n</html>"
            : "Escribe tu correo aquí..."
        }
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false} // Desactiva el corrector ortográfico
      ></textarea>
    </div>
  );
};

export default TextEdit;