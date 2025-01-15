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
        FFmFilterNode: `${label || ""}${Input}`,
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
          width: tutorialOpen ? "500px" : "180px",
          padding: "0",
          overflow: "clip",
        }}
        className="react-flow__node-default"
      >
        <p style={{ font: "16px Arial, sans-serif" }}>
          {label}
          <input
            onChange={handleInputChange}
            style={{
              display: "inline",
              width: "140px",
              fontSize: "10px",
              margin: "0",
              textAlign: "center",
            }}
            placeholder={placeholder}
          />
        </p>
        <button onClick={() => setTutorialOpen(!tutorialOpen)}>
          {tutorialOpen ? "Close" : "Open"} Tutorial
        </button>
        {tutorialOpen && (
          <div
            style={{
              margin: "3px",
              width: "95%",
              height: "95%",
              border: "black 1px solid",
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
