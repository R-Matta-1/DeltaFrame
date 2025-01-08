import { Position, Handle } from "@xyflow/react";

export function getDivHandleId(mediaType, type, id) {
  return mediaType + type + id;
}
export function DivHandle(unalteredParams) {
  const params = { ...unalteredParams };
  const StyleColor = params.type === "target" ? "white" : "white";
  params.id = getDivHandleId(params.mediaType, params.type, params.id);

  const style = {
    border: "solid black 1px",
    position: "absolute",
    borderRadius: "20%",
    width: "20px",
    height: "20px",
    fontFamily: "monospace",
    fontSize: "15px",
    backgroundColor: StyleColor,
    zIndex: 100,
    ...params.style,
  };

  return (
    <>
      <Handle {...params} style={style}>
        <p
          style={{
            margin: "auto",
            zIndex: -1,
            padding: "3px",
            pointerEvents: "none",
          }}
        >
          {params.mediaType == MediaTypes.VIDEO ? "V" : null}
          {params.mediaType == MediaTypes.AUDIO ? "A" : null}
        </p>
      </Handle>
    </>
  );
}

export const MediaTypes = {
  VIDEO: "video",
  AUDIO: "audio",
};
