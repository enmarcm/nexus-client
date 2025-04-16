import React, { createContext, useContext, useReducer } from "react";

interface SmsState {
  selectedCard: string | null;
  phoneNumbers: string[];
  uploadedFile: File | null;
  selectedGroup: string | null;
}

type SmsAction =
  | { type: "SET_SELECTED_CARD"; payload: string | null }
  | { type: "SET_PHONE_NUMBERS"; payload: string[] }
  | { type: "SET_UPLOADED_FILE"; payload: File | null }
  | { type: "SET_SELECTED_GROUP"; payload: string | null };

const initialState: SmsState = {
  selectedCard: null,
  phoneNumbers: [],
  uploadedFile: null,
  selectedGroup: null,
};

const SmsDataContext = createContext<{
  state: SmsState;
  dispatch: React.Dispatch<SmsAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const smsReducer = (state: SmsState, action: SmsAction): SmsState => {
  switch (action.type) {
    case "SET_SELECTED_CARD":
      return { ...state, selectedCard: action.payload };
    case "SET_PHONE_NUMBERS":
      return { ...state, phoneNumbers: action.payload };
    case "SET_UPLOADED_FILE":
      return { ...state, uploadedFile: action.payload };
    case "SET_SELECTED_GROUP":
      return { ...state, selectedGroup: action.payload };
    default:
      return state;
  }
};

export const SmsDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(smsReducer, initialState);

  return (
    <SmsDataContext.Provider value={{ state, dispatch }}>
      {children}
    </SmsDataContext.Provider>
  );
};

export const useSmsDataGlobal = () => useContext(SmsDataContext);