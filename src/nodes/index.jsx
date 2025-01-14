import { getEdgeCenter, Position, useReactFlow } from "@xyflow/react";
import { useCallback, useRef, useState, useEffect } from "react";

import { DivHandle, getDivHandleId, MediaTypes } from "./DivHandle";
import VideoOutput from "./VideoOutput";
import CreateNodeType from "./TemplateNode";

function VideoInput({ id, Data }) {
  const { updateNodeData } = useReactFlow();
  const [VideoLength, setVideoLength] = useState(0);
  const [ShowMedia, setShowMedia] = useState(false);
  const [VideoLink, setVideoLink] = useState("");
  const [File, setFile] = useState("");
  const inputRef = useRef(null);
  const SliderRef = useRef(null);
  const videoRef = useRef(null);

  function RedirectClick(event) {
    const HiddenInput = inputRef.current;
    console.log(HiddenInput);
    if (inputRef.current) {
      console.log("click happen");

      HiddenInput.click();
    }
  }

  function InputAdition(e) {
    if (!e.target?.files[0]) return;
    const file = e.target.files[0];
    const InputVideoURL = URL.createObjectURL(file);
    setVideoLink(InputVideoURL);
    setFile(file);
    console.log(file);
    updateNodeData(id, {
      fileURL: file.name,
      fileBlobUrl: InputVideoURL,
      file: file,
      StartTime: 0,
    });
    if (SliderRef.current) {
      SliderRef.current.value = 0;
    }
  }

  const sliderInputHandle = useCallback(() => {
    const SliderValue = SliderRef.current.value;
    videoRef.current.currentTime = SliderValue;
    updateNodeData(id, {
      StartTime: SliderValue,
    });
  }, [SliderRef, videoRef, updateNodeData]);

  const buttonStyle = {
    position: "absolute",
    width: `50px`,
    height: `25px`,
    backgroundColor: "#ece",
    justifyContent: "center",
    top: "-6px",
  };
  return (
    <div
      style={{
        justifyContent: "center",
        width: ShowMedia && VideoLink ? "500px" : "200px",
        height: ShowMedia && VideoLink ? "333px" : "100px",
      }}
      className="react-flow__node-default"
    >
      <button
        onClick={RedirectClick}
        style={{
          ...buttonStyle,
          left: VideoLink ? "25px" : "90px",
        }}
      >
        Input
      </button>

      {VideoLink && (
        <button
          onClick={() => setShowMedia(!ShowMedia)}
          style={{
            ...buttonStyle,
            right: "25px",
          }}
        >
          {ShowMedia ? "hide" : "show"}
        </button>
      )}

      <input
        hidden
        onChange={InputAdition}
        style={{ position: "relative" }}
        ref={inputRef}
        type="file"
        className="videoInput"
        accept="video/*,audio/*,image/*"
      />

      {VideoLink && !File.type.startsWith("image") && (
        <>
          <video
            controls={ShowMedia || File.type.startsWith("audio")}
            style={{
              marginTop: "15px",
              maxHeight: "calc(100% - 40px)",
              maxWidth: "100%",
            }}
            ref={videoRef}
            onLoadedMetadata={() => {
              setVideoLength(videoRef.current.duration);
            }}
            src={VideoLink}
          >
            needs video suprt
          </video>
          <br />
          <label style={{ fontFamily: "Arial, sans-serif" }} htmlFor="in">
            -ss
          </label>
          <input
            className="nodrag"
            type="range"
            min={0}
            max={VideoLength}
            step={0.1}
            name="in"
            ref={SliderRef}
            onChange={sliderInputHandle}
          />
        </>
      )}
      {VideoLink && File.type.startsWith("image") && (
        <img
          src={VideoLink}
          type={File.type}
          style={{ maxHeight: "calc(100% - 20px)", maxWidth: "100%" }}
        />
      )}

      <DivHandle
        type="source"
        id="1"
        position={Position.Right}
        style={{
          top: "33%",
          backgroundColor:
            File.type?.startsWith("v") || File.type?.startsWith("i")
              ? "#cfc"
              : "#fcc",
        }}
        mediaType={MediaTypes.VIDEO}
      />

      <DivHandle
        type="source"
        id="2"
        position={Position.Right}
        style={{
          top: "66%",
          backgroundColor:
            File.type?.startsWith("v") || File.type?.startsWith("a")
              ? "#cfc"
              : "#fcc",
        }}
        mediaType={MediaTypes.AUDIO}
      />
    </div>
  );
}

const VideoScale = CreateNodeType(
  "crop=",
  "iw:-1:0:0",
  "https://trac.ffmpeg.org/wiki/Blend",
  [
    {
      type: "target",
      mediaType: MediaTypes.VIDEO,
      position: Position.Left,
      style: {},
    },
    {
      type: "source",
      mediaType: MediaTypes.VIDEO,
      position: Position.Right,
      style: {},
    },
  ]
);

const cropVideo = CreateNodeType(
  "crop=",
  "iw:-1:0:0",
  "https://trac.ffmpeg.org/wiki/Blend",
  [
    {
      type: "target",
      mediaType: MediaTypes.VIDEO,
      position: Position.Left,
      style: {},
    },
    {
      type: "source",
      mediaType: MediaTypes.VIDEO,
      position: Position.Right,
      style: {},
    },
  ]
);

const VideoBlend = CreateNodeType(
  "blend=",
  "diffrence",
  "https://trac.ffmpeg.org/wiki/Blend",
  [
    {
      type: "target",
      mediaType: MediaTypes.VIDEO,
      position: Position.Left,
      style: { top: "33%" },
    },
    {
      type: "target",
      mediaType: MediaTypes.VIDEO,
      position: Position.Left,
      style: { top: "66%" },
    },
    {
      type: "source",
      mediaType: MediaTypes.VIDEO,
      position: Position.Right,
      style: {},
    },
  ]
);
export const nodeTypes = {
  Output: VideoOutput,
  Input: VideoInput,
  Blend: VideoBlend,
  Scale: VideoScale,
  Crop: cropVideo,
};

/// THis should be the ONLY place where the names are hardcoded
export const InitalNodes = [
  { id: "a", type: "Input", position: { x: 10, y: 50 }, data: {} },
  { id: "d", type: "Input", position: { x: 10, y: 270 }, data: {} },
  { id: "b", type: "Blend", position: { x: 365, y: 150 }, data: {} },
  { id: "c", type: "Output", position: { x: 370, y: 390 }, data: {} },
];
