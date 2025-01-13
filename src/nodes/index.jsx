import { getEdgeCenter, Position, useReactFlow } from "@xyflow/react";
import { useCallback, useRef, useState, useEffect } from "react";

import { DivHandle, getDivHandleId, MediaTypes } from "./DivHandle";
import VideoOutput from "./VideoOutput";

function VideoDifference({ id, Data }) {
  const { updateNodeData } = useReactFlow();
  useEffect(() => {
    updateNodeData(id, { FFmFilterNode: "blend=difference" });
  }, []);
  return (
    <div
      style={{ height: "15%", width: "110px", padding: "0" }}
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
  );
}

function VideoScale({ id, Data }) {
  const { updateNodeData } = useReactFlow();
  const [Input, setInput] = useState("iw:ih:0:0");
  const [TutorialOpen, setTutorialOpen] = useState(false);
  useEffect(() => {
    updateNodeData(id, { FFmFilterNode: `scale=${Input}` });
    console.log(Input);
  }, [Input]);

  const InputHandle = (event) => {
    const newVal = event.target.value;
    const CleanVal = newVal.replace(/['"\s]/g, "");
    setInput(CleanVal);
  };

  const inputStyle = {
    display: "inline",
    width: "140px",
    fontSize: "10px",
    margin: "0",
    textAlign: "center",
  };
  return (
    <div
      style={{
        height: TutorialOpen ? "600px" : "90px",
        width: TutorialOpen ? "300px" : "180px",
        padding: "0",
        overflow: "clip",
      }}
      className="react-flow__node-default"
    >
      <p style={{ font: "16px Arial, sans-serif" }}>
        scale=
        <input
          onChange={InputHandle}
          style={inputStyle}
          placeholder="iw:ih:0:0"
        />
      </p>
      <button onClick={() => setTutorialOpen(!TutorialOpen)}>
        {TutorialOpen ? "close" : "open"} Tutorial
      </button>
      {TutorialOpen && (
        <div style={{ font: "14px Arial, sans-serif" }}>
          <h3>Scale Filter Tutorial</h3>
          <p>
            <code>scale=w:h:x:y</code>
          </p>
          <ul>
            <li>
              <code>w</code>: Width
            </li>
            <li>
              <code>h</code>: Height
            </li>
            <li>
              <code>x</code>: Horizontal position
            </li>
            <li>
              <code>y</code>: Vertical position
            </li>
          </ul>
          <p>
            Using <code>-1</code>, <code>iw</code>, and <code>ih</code>:
          </p>
          <ul>
            <li>
              <code>-1</code>: Maintains aspect ratio
            </li>
            <li>
              <code>iw</code>: Input width
            </li>
            <li>
              <code>ih</code>: Input height
            </li>
          </ul>
          <h4>Examples</h4>
          <pre>
            <code>"scale=640:-1"</code>
            <p>
              Resizes the video to 640 pixels wide,
              <br /> maintaining aspect ratio.
            </p>
          </pre>
          <pre>
            <code>"scale=iw/2:ih/2:iw/4:ih/4"</code>
            <p>
              Resizes the video to half its original width and height, <br />
              and then positions it at one-quarter <br />
              of the original width and height.
            </p>
          </pre>
        </div>
      )}
      <DivHandle
        type="target"
        id="2"
        position={Position.Left}
        mediaType={MediaTypes.VIDEO}
      />
      <DivHandle
        type="source"
        id="3"
        position={Position.Right}
        mediaType={MediaTypes.VIDEO}
      />
    </div>
  );
}

function VideoInput({ id, Data }) {
  const { updateNodeData } = useReactFlow();
  const [VideoLink, setVideoLink] = useState("");
  const [VideoLength, setVideoLength] = useState(0);
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

  return (
    <div
      style={{
        justifyContent: "center",
        width: "200px",
        height: "150px",
      }}
      className="react-flow__node-default"
    >
      <button
        onClick={RedirectClick}
        style={{
          position: "relative",
          width: `100px`,
          height: `25px`,
          backgroundColor: "#bbd",
          justifyContent: "center",
          top: "-12.5px",
        }}
      >
        Click To Input
      </button>
      <input
        hidden
        onChange={InputAdition}
        style={{ position: "relative" }}
        ref={inputRef}
        type="file"
        className="videoInput"
        accept="video/*"
      />

      {VideoLink && (
        <>
          <video
            height={"100px"}
            ref={videoRef}
            onLoadedMetadata={() => {
              setVideoLength(videoRef.current.duration);
            }}
            src={VideoLink}
          >
            needs video suprt
          </video>
          <br />
          <label htmlFor="in">VideoStart</label>
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
  Input: VideoInput,
  Difference: VideoDifference,
  Scale: VideoScale,
};

/// THis should be the ONLY place where the names are hardcoded
export const InitalNodes = [
  { id: "a", type: "Input", position: { x: 10, y: 50 }, data: {} },
  { id: "d", type: "Input", position: { x: 10, y: 270 }, data: {} },
  { id: "b", type: "Difference", position: { x: 365, y: 150 }, data: {} },
  { id: "c", type: "Output", position: { x: 370, y: 390 }, data: {} },
];
