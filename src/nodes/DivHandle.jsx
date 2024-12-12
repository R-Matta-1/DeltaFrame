import { Position, Handle } from "@xyflow/react";

export function DivHandle(unalteredParams) {
  const params = { ...unalteredParams };

  params.id = params.mediaType + params.type + params.id;

  const divStyle = {
    border: "solid black 1px",
    zIndex: -1,
    position: "absolute",
    width: "10px",
    height: "10px",
    top: "-2.5px",
    font: "8px  Verdana black",
  };

  if (params.position === Position.Left) {
    divStyle.left = "-15px";
  } else {
    divStyle.right = "-15px";
  }

  if (params.type === "target") {
    divStyle.backgroundColor = "#fcf";
  } else {
    divStyle.backgroundColor = "#cfc";
  }

  return (
    <>
      <Handle style={{ zIndex: "100" }} {...params}>
        <div style={divStyle}>
          {params.mediaType == MediaTypes.VIDEO ? "V" : null}
          {params.mediaType == MediaTypes.AUDIO ? "A" : null}
        </div>
      </Handle>
    </>
  );
}

export const MediaTypes = {
  VIDEO: "video",
  AUDIO: "audio",
};
