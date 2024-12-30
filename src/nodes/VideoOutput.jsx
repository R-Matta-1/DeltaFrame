import { useReactFlow, getIncomers, Position } from "@xyflow/react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useState, useRef } from "react";
import { DivHandle, MediaTypes } from "./DivHandle";

function TokenizeString(string) {
  let tokenizedString = [];

  let isString = false;
  let currentSubString = "";

  for (const char of string) {
    currentSubString += char;
    if (char === '"') {
      isString = !isString;
    }
    if (!isString && char === " " && currentSubString.trim()) {
      tokenizedString.push(currentSubString.trim().replaceAll('"', ""));
      currentSubString = "";
    }
  }
  if (currentSubString.trim()) {
    tokenizedString.push(currentSubString.trim().replaceAll('"', ""));
  }

  return tokenizedString;
}

export default function VideoOutput({ id, x, y, Data }) {
  const { getNodes, getEdges, getNode, getHandleConnections } = useReactFlow();

  const [FFMinput, setFFMinput] = useState(" ");
  const [FFMinputFiles, setFFMinputFiles] = useState([]);
  const [FFMfilter, setFFMfilter] = useState(" ");
  const [FFMmap, setFFMmap] = useState(" ");

  const [source, setSource] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("messages show up here");
  const ffmpegRef = useRef(new FFmpeg());

  const initalizeFFm = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      setMessage(message);
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    setLoaded(true);
  };

  // generate the ffmpeg command
  const generateCommand = () => {
    console.log(getEdges());
    // Generate the ffmpeg command
    setFFMinputFiles([]);
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
        input = input + ` -i \"${node.data.fileURL}\" `;
        setFFMinputFiles((FFMinputFiles) => [...FFMinputFiles, node.data.file]);
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
    }
    // remove that leading semicolon in filter
    if (filter[filter.length - 1] == ";") {
      // i mean.. this is always true but for the sake of readability
      filter = filter.slice(0, -1);
    }
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
  const GenerateVideo = async () => {
    generateCommand();

    console.log("generating video");
    const ffmpeg = ffmpegRef.current;

    for (let i = 0; i < FFMinputFiles.length; i++) {
      const file = FFMinputFiles[i];
      const videoFile = await fetchFile(file);
      await ffmpeg.writeFile(file.name, videoFile);
      console.log("wrote file: ");
      console.log(file);
    }
    const TokenizedCommand = TokenizeString(
      "-y" + FFMinput + " " + FFMfilter + " -t 3 " + FFMmap
    );
    console.log(TokenizedCommand);
    await ffmpeg.exec(TokenizedCommand);

    const fileData = await ffmpeg.readFile("outfile.mp4");
    const finalSource = URL.createObjectURL(
      new Blob([fileData.buffer], { type: "video/mp4" })
    );
    setSource(finalSource);
  };

  return (
    <div
      style={{ justifyContent: "center", width: "260px" }}
      className="react-flow__node-default"
    >
      <button onClick={generateCommand}>gernerate command</button>
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
      <br />
      {loaded ? (
        <button onClick={GenerateVideo}>now generate thing</button>
      ) : (
        <button onClick={initalizeFFm}>clk to lod FFM</button>
      )}
      {source && <video src={source} width={500} controls alt="logo" />}
      <p>{message}</p>
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
