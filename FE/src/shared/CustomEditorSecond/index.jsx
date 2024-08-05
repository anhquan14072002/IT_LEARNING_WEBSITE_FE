import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
import "./UncontrollEditor.css"; // Import your custom CSS

const UncontrolledEditor = ({ onChange }) => {
  const [editorHtml, setEditorHtml] = useState("");

  const handleChange = (value) => {
    setEditorHtml(value);
    onChange(value); // Call onChange with the updated content
  };

  return (
    <ReactQuill
      value={editorHtml}
      onChange={handleChange}
      modules={editorModules}
      theme="snow"
      className="h-36"
    />
  );
};

// Optional: Configure the editor modules and toolbar
const editorModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    ["link", "image"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

export default UncontrolledEditor;
