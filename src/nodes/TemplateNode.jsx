import React, { useEffect, useState } from "react";
import { DivHandle, MediaTypes } from "./DivHandle";
import { useReactFlow, Position } from "@xyflow/react";

const TemplateNodeCreator = (label, placeholder, Tutorial, handles) => {
  return function Node({ id, data }) {
    const { updateNodeData } = useReactFlow();
    const [Input, setInput] = useState(placeholder || "");
    const [tutorialOpen, setTutorialOpen] = useState(false);

    useEffect(() => {
      updateNodeData(id, {
        FFmFilterNode: `${label || placeholder}${Input}`,
      });
    }, [Input]);

    const handleInputChange = (event) => {
      const cleanValue = event.target.value.replace(/['\s]/g, "");
      setInput(cleanValue);
    };

    return (
      <div
        style={{
          height: tutorialOpen ? "550px" : "90px",
          width: tutorialOpen ? "450px" : "180px",
          padding: "0",
          overflow: "clip",
          justifyItems: "center",
        }}
        className="react-flow__node-default"
      >
        <p
          style={{
            marginBottom: "0",
            font: "25px Arial, sans-serif",
            marginTop: "3px",
          }}
        >
          {label}
        </p>
        <textarea
          onChange={handleInputChange}
          style={{
            resize: "none",
            display: "inline",
            width: "140px",
            fontSize: "10px",
            margin: "0",
            textAlign: "center",
          }}
          placeholder={placeholder}
        />
        <br></br>
        <button onClick={() => setTutorialOpen(!tutorialOpen)}>
          {tutorialOpen ? "Close" : "Open"} Reference
        </button>
        {tutorialOpen && (
          <div
            style={{
              margin: "4px",
              width: "95%",
              height: "95%",
              border: "black 1px solid",
              backgroundColor: "#222",
              color: "#fff",
              fontFamily: "monospace",
              fontSize: "35px",
              justifyContent: "center",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            <Tutorial />
          </div>
        )}

        {handles.map((handle, index) => (
          <DivHandle
            key={index}
            type={handle.type}
            id={index}
            position={handle.position}
            mediaType={handle.mediaType}
            style={handle.style}
          />
        ))}
      </div>
    );
  };
};

export default TemplateNodeCreator;
