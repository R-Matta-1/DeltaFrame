import { getEdgeCenter, Position, useReactFlow } from "@xyflow/react";
import { useCallback, useRef, useState, useEffect } from "react";

import { DivHandle, getDivHandleId, MediaTypes } from "./DivHandle";
import VideoOutput from "./VideoOutput";

function VideoDifference({ x, y, id, Data }) {
  const { updateNodeData } = useReactFlow();
  useEffect(() => {
    updateNodeData(id, { FFmFilterNode: "blend=difference" });
  }, []);
  return (
    <>
      <div
        style={{ height: "20%", padding: "0" }}
        className="react-flow__node-default"
      >
        <p style={{ font: "15px Verdana" }}>Difference</p>

        <DivHandle
          type="target"
          id="1"
          position={Position.Left}
          mediaType={MediaTypes.VIDEO}
          style={{ top: "75%" }}
        />

        <DivHandle
          type="target"
          id="2"
          position={Position.Left}
          mediaType={MediaTypes.VIDEO}
          style={{ top: "25%" }}
        />

        <DivHandle
          type="source"
          id="3"
          position={Position.Right}
          mediaType={MediaTypes.VIDEO}
        />
      </div>
    </>
  );
}

function VideoInput({ id, Data }) {
  const { updateNodeData } = useReactFlow();
  const [VideoLink, ChangeVideoLink] = useState("");
  const width = 300;
  const height = 150;
  const inputRef = useRef(null);

  function RedirectClick(event) {
    const HiddenInput = inputRef.current;
    console.log(HiddenInput);
    if (inputRef.current) {
      console.log("click happen");

      HiddenInput.click();
    }
  }

  function InputAdition(e) {
    const file = e.target.files[0];
    const InputVideoURL = URL.createObjectURL(file);
    ChangeVideoLink(InputVideoURL);
    updateNodeData(id, {
      fileURL: file.name,
      fileBlobUrl: InputVideoURL,
    });
  }

  return (
    <div
      style={{
        justifyContent: "center",
        width: `${width}px`,
        height: `${height}px`,
      }}
      className="react-flow__node-default"
    >
      {VideoLink && (
        <video controls height={height - 30} src={VideoLink}></video>
      )}

      <button
        onClick={RedirectClick}
        style={{
          position: "absolute",
          width: `100px`,
          height: `27px`,
          backgroundColor: "#bbd",
          justifyContent: "center",
          bottom: "3px",
          left: `${width / 2 - 100 / 2}px`,
        }}
      >
        Click To Input
      </button>
      <input
        hidden
        onChange={InputAdition}
        style={{ position: "absolute" }}
        ref={inputRef}
        type="file"
        className="videoInput"
        accept="video/*"
      />

      <DivHandle
        type="source"
        id="1"
        position={Position.Right}
        style={{ top: "33%" }}
        mediaType={MediaTypes.VIDEO}
      />

      <DivHandle
        type="source"
        id="2"
        position={Position.Right}
        style={{ top: "66%" }}
        mediaType={MediaTypes.AUDIO}
      />
    </div>
  );
}

export const nodeTypes = {
  Output: VideoOutput,
  Difference: VideoDifference,
  Input: VideoInput,
};

/// THis should be the ONLY place where the names are hardcoded
export const InitalNodes = [
  { id: "a", type: "Input", position: { x: 10, y: 50 }, data: {} },
  { id: "d", type: "Input", position: { x: 10, y: 270 }, data: {} },
  { id: "b", type: "Difference", position: { x: 365, y: 150 }, data: {} },
  { id: "c", type: "Output", position: { x: 370, y: 390 }, data: {} },
];
