import { Position } from "@xyflow/react";
import { MediaTypes } from "./DivHandle";
import VideoOutput from "./VideoOutput";
import CreateNodeType from "./TemplateNode";
import VideoInput from "./VideoInput";

const VideoScale = CreateNodeType(
  "scale=",
  "iw:-1:0:0",
  function Tutorial() {
    return <>apple</>;
  },
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
  function Tutorial() {
    return <>apple</>;
  },
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
  function Tutorial() {
    return <>apple</>;
  },
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
