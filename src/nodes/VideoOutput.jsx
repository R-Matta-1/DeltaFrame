import { useReactFlow, getIncomers, Position } from "@xyflow/react";
import { useState } from "react";
import { DivHandle, MediaTypes } from "./DivHandle";

export default function VideoOutput({ id, x, y, Data }) {
  const [FFMinput, setFFMinput] = useState(" ");
  const [FFMfilter, setFFMfilter] = useState(" ");
  const [FFMmap, setFFMmap] = useState(" ");
  const { getNodes, getEdges, getNode, getHandleConnections } = useReactFlow();

  const buttonClick = () => {
    console.log(getEdges());
    // Generate the ffmpeg command
    const thisNode = getNode(id);
    let filter = "";
    let input = "";
    let inputNodesAccesed = [];
    let mapping = "";

    let Requirements = getIncomers(thisNode, getNodes(), getEdges());

    while (Requirements.length != 0) {
      const node = Requirements.shift();
      Requirements.push(...getIncomers(node, getNodes(), getEdges()));

      if (node?.data?.fileURL) {
        input = input + ` i- \"${node.data.fileURL}\" `;
        continue;
      }
      if (node?.data?.FFmFilterNode) {
        let FFmFilterNode = node.data.FFmFilterNode;
        // now we have FFmFilterNode we can add it's input and output edges

        const InEdges = getEdges().filter((edge) => edge.target == node.id);
        const OutEdges = getEdges().filter((edge) => edge.source == node.id);

        // for every edge going INTO our node, we add a [edge] to the node
        InEdges.forEach((edge) => {
          // if the source is an input node, we need to add the index of the input node
          if (getNode(edge.source).type == "Input") {
            // the following code
            const IdOfInputNode = getNode(edge.source).id;
            if (!inputNodesAccesed.includes(IdOfInputNode)) {
              console.log("adding input node: " + IdOfInputNode);
              console.log(inputNodesAccesed);
              inputNodesAccesed.push(IdOfInputNode);
            }
            FFmFilterNode =
              "[" +
              inputNodesAccesed.indexOf(IdOfInputNode) +
              "]" +
              FFmFilterNode;
          } else {
            // NOT a input node, so we just add the edge
            FFmFilterNode = "[" + edge.target + "]" + FFmFilterNode;
          }
        });

        OutEdges.forEach((edge) => {
          FFmFilterNode = FFmFilterNode + "[" + edge.target + "]";
        });

        filter = FFmFilterNode + ";" + filter;
        continue;
      }

      // resolve the handle
    }

    //TODO: Resolve all other edges that would be a part of filter
    mapping = "-map [" + id + "]" + " outfile.mp4";
    filter = '-filter_complex "' + filter + '"';

    if (filter == '-filter_complex ""') {
      filter = "";
      mapping = "outfile.mp4";
    }

    setFFMinput(input);

    setFFMfilter(filter);
    setFFMmap(mapping);
  };

  const CopyCommandToClipboard = () => {
    navigator.clipboard.writeText(`ffmpeg ${FFMinput} ${FFMfilter} ${FFMmap}`);
  };
  return (
    <div
      style={{ justifyContent: "center", width: "260px" }}
      className="react-flow__node-default"
    >
      <button onClick={buttonClick}>gernerate command</button>
      <div
        style={{
          backgroundColor: "#000",
          fontFamily: "monospace",
          fontSize: "smaller",
          margin: "5px",
        }}
      >
        <span style={{ color: "#FFFFFF" }}>ffmpeg </span>
        <br />
        <span style={{ color: "#FDFDCB" }}>{FFMinput}</span>
        <br />
        <span style={{ color: "#90D7FF" }}>{FFMfilter}</span>
        <br />
        <span style={{ color: "#C9F90F" }}>{FFMmap}</span>
        <br />
      </div>

      <button onClick={CopyCommandToClipboard}>copyToClipboard</button>

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
