import React, { createContext, useReducer, useContext, ReactNode } from "react";

// Definir el estado inicial
interface EmailDataState {
  selectedCard: string | null;
  emails: string[];
  uploadedFile: File | null;
  selectedGroup: string | null;
}

const initialState: EmailDataState = {
  selectedCard: null,
  emails: [],
  uploadedFile: null,
  selectedGroup: null,
};

// Definir las acciones
type Action =
  | { type: "SET_SELECTED_CARD"; payload: string | null }
  | { type: "SET_EMAILS"; payload: string[] }
  | { type: "SET_UPLOADED_FILE"; payload: File | null }
  | { type: "SET_SELECTED_GROUP"; payload: string | null };

// Reducer para manejar el estado global
const emailDataReducer = (state: EmailDataState, action: Action): EmailDataState => {
  switch (action.type) {
    case "SET_SELECTED_CARD":
      return { ...state, selectedCard: action.payload };
    case "SET_EMAILS":
      return { ...state, emails: action.payload };
    case "SET_UPLOADED_FILE":
      return { ...state, uploadedFile: action.payload };
    case "SET_SELECTED_GROUP":
      return { ...state, selectedGroup: action.payload };
    default:
      return state;
  }
};

// Crear el contexto
const EmailDataGlobalContext = createContext<{
  state: EmailDataState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Proveedor del contexto
export const EmailDataGlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(emailDataReducer, initialState);

  return (
    <EmailDataGlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </EmailDataGlobalContext.Provider>
  );
};

// Hook para usar el contexto
export const useEmailDataGlobal = () => useContext(EmailDataGlobalContext);