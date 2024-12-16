import {
  getEdgeCenter,
  getIncomers,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useRef, useState } from "react";

import { DivHandle, getDivHandleId, MediaTypes } from "./DivHandle";

function VideoOutput({ id, x, y, Data }) {
  const [FFMPEGCommand, setFFMPEGCommand] = useState(" ");
  const { getNodes, getEdges, getNode, getHandleConnections } = useReactFlow();

  const buttonClick = () => {
    const thisNode = getNode(id);
    const thisVideoInput = getHandleConnections({
      type: "target",
      nodeId: id,
      id: "videotarget1",
    });
    const thisAudioInput = getHandleConnections({
      type: "target",
      nodeId: id,
      id: "audiotarget2",
    });

    let filter = '-filter_complex "';
    let input = "";
    let mapping = "";
    let Requirements = getIncomers(thisNode, getNodes(), getEdges());

    while (Requirements.length != 0) {
      const node = Requirements.shift();
      Requirements.push(...getIncomers(node, getNodes(), getEdges()));

      if (node.data.fileURL != undefined) {
        input = input + ` i- \"${node.data.fileURL}\" `;
      }
      // resolve the handle
      console.log(node);
    }
    //TODO: Resolve all other edges that would be a part of filter

    filter = filter + '"';

    const command = "ffmpeg " + input + filter + mapping;
    setFFMPEGCommand(command);
  };
  return (
    <div
      style={{ justifyContent: "center", width: "360px" }}
      className="react-flow__node-default"
    >
      <button onClick={buttonClick}>gernerate command</button>
      <div
        style={{
          backgroundColor: "#ccc",
          fontFamily: "monospace",
          fontSize: "smaller",
          margin: "5px",
        }}
      >
        {FFMPEGCommand}
      </div>
      <video
        controls
        src="https://upload.wikimedia.org/wikipedia/commons/d/d9/177_day_spin_up_zonal_velocity.webm"
      ></video>

      <DivHandle
        type="target"
        id="1"
        mediaType={MediaTypes.VIDEO}
        position={Position.Left}
        style={{ top: "33%" }}
      />
      <DivHandle
        type="target"
        id="2"
        mediaType={MediaTypes.AUDIO}
        position={Position.Left}
        style={{ top: "66%" }}
      />
    </div>
  );
}

function VideoDifference({ x, y, Data }) {
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
