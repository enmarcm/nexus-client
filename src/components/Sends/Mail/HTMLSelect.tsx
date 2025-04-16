
const HTMLSelect = ({
  editorType,
  setEditorType,
}: {
  editorType: "html" | "text";
  setEditorType: (type: "html" | "text") => void;
}) => {
  return (
    <div className="flex bg-gray-200 rounded-md overflow-hidden">
      <button
        className={`px-4 py-2 text-sm font-semibold ${
          editorType === "html" ? "bg-purple-500 text-white" : "text-gray-700"
        } transition`}
        onClick={() => setEditorType("html")}
      >
        HTML
      </button>
      <button
        className={`px-4 py-2 text-sm font-semibold ${
          editorType === "text" ? "bg-purple-500 text-white" : "text-gray-700"
        } transition`}
        onClick={() => setEditorType("text")}
      >
        Texto
      </button>
    </div>
  );
};

export default HTMLSelect;