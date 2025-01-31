import { useReactFlow, getIncomers, Position } from "@xyflow/react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useState, useRef, useEffect } from "react";
import { DivHandle, MediaTypes } from "./DivHandle";
import MediaDisplay from "../MediaDisplay.jsx";
import CopyIcon from "../copy-svgrepo-com (1).jsx";

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

function RemoveRepeat(string) {
  let arr = string.split(";");
  let newarr = [];
  arr.forEach((element) => {
    if (!newarr.includes(element)) {
      newarr.push(element);
    }
  });
  return newarr.join(";");
}

export default function VideoOutput({ id, x, y, Data }) {
  const { getNodes, getEdges, getNode, getHandleConnections } = useReactFlow();

  const [FFMinput, setFFMinput] = useState(" ");
  const [FFMfilter, setFFMfilter] = useState(" ");
  const [FFMmap, setFFMmap] = useState(" ");
  const [Outfile, setOutfile] = useState("outfile");
  const [selectedMimeType, setSelectedMimeType] = useState("video/mp4");
  const [OutfileName, setOutfileName] = useState("");
  useEffect(() => {
    setOutfileName(
      Outfile +
        "." +
        selectedMimeType.substring(selectedMimeType.indexOf("/") + 1)
    );
    console.log(
      `${Outfile}.${selectedMimeType.substring(
        selectedMimeType.indexOf("/") + 1
      )}`
    );
  }, [selectedMimeType, Outfile]);
  const [TextCoppied, setTextCoppied] = useState(false);

  const [source, setSource] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [StartedLoading, setStartedLoading] = useState(false);
  const [messages, setMessages] = useState(["FFMPEG Logs:"]);
  const ffmpegRef = useRef(new FFmpeg());

  const initalizeFFm = async () => {
    setStartedLoading(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      setMessages((previous) => [message, ...previous.slice(0, 10)]);
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
    // Generate the ffmpeg command
    let FFMinputFiles = [];
    const thisNode = getNode(id);
    let filter = "";
    let input = "";
    let inputNodesAccesed = [];
    let NamesAsOutputInFiltergraph = [];
    let mapping = "";

    let Requirements = [thisNode];

    while (Requirements.length != 0) {
      const node = Requirements.shift();
      Requirements.push(...getIncomers(node, getNodes(), getEdges()));

      if (node?.type === "Input") {
        const time =
          node.data.StartTime == 0 ? "" : ` -ss ${node.data.StartTime} `;
        input = input + time + ` -i \"${node.data?.fileURL}\"`;

        FFMinputFiles.push(node.data.file);

        // btw if the connnection is direct then no one has noted this input guy before
        if (!inputNodesAccesed.includes(node.id)) {
          inputNodesAccesed.push(node.id);
        }
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
              inputNodesAccesed.push(IdOfInputNode);
            }
            FFmFilterNode =
              "[" +
              inputNodesAccesed.indexOf(IdOfInputNode) +
              "]" +
              FFmFilterNode;
          } else {
            // NOT a input node, so we just add the edge
            FFmFilterNode = "[" + edge.source + "]" + FFmFilterNode;
          }
        });

        // OutEdges must not be empty, because it was added to the Requirements
        FFmFilterNode = FFmFilterNode + "[" + OutEdges[0].source + "]";
        NamesAsOutputInFiltergraph.push(OutEdges[0].source);

        filter = FFmFilterNode + ";" + filter;
      }
    }
    // remove that leading semicolon in filter
    if (filter[filter.length - 1] == ";") {
      filter = filter.slice(0, -1);
    }
    // they have to be removed in a method such that order is preserved (ASK ME IF THIS IS A PROBLEM)
    filter = RemoveRepeat(filter);

    filter = '-filter_complex "' + filter + '"';

    // now we need to add the mapping

    const DirectConnections = getEdges().filter((edge) => edge.target == id);

    const DirectVideo = DirectConnections.filter(
      (edge) => edge.targetHandle.substring(0, 3) == "vid"
    );

    const DirectAudio = DirectConnections.filter(
      (edge) => edge.targetHandle.substring(0, 3) == "aud"
    );

    if (DirectVideo.length > 0) {
      const DirectVideoId = DirectVideo[0].source;
      const DirectVideoType = getNode(DirectVideoId).type;
      let DirectId = "";
      if (DirectVideoType == "Input") {
        DirectId = inputNodesAccesed.indexOf(DirectVideoId) + ":v";
      } else {
        DirectId = `"[` + DirectVideo[0].source + `]"`;
      }
      mapping += `-map ${DirectId}`;
    }

    if (DirectAudio.length > 0) {
      const DirectAudioId = DirectAudio[0].source;
      const DirectAudioType = getNode(DirectAudioId).type;
      let DirectId = "";

      if (DirectAudioType == "Input") {
        DirectId = inputNodesAccesed.indexOf(DirectAudioId) + ":a";
      } else {
        DirectId = `"[` + DirectAudio[0].source + `]"`;
      }
      mapping += ` -map ${DirectId} `;
    }

    if (filter == '-filter_complex ""') {
      filter = "";
    }

    return [
      FFMinputFiles,
      input,
      filter,
      mapping,
      OutfileName,
      selectedMimeType,
    ];
  };

  const CopyCommandToClipboard = () => {
    navigator.clipboard.writeText(`ffmpeg ${FFMinput} ${FFMfilter} ${FFMmap}`);
    setTextCoppied(true);
  };

  const LoadCommand = () => {
    const [, FFMinput, FFMfilter, FFMmap, FFMoutputName] = generateCommand();
    setFFMinput(FFMinput);
    setFFMfilter(FFMfilter);
    setFFMmap(FFMmap + " " + FFMoutputName);
    setTextCoppied(false);
  };

  const GenerateVideo = async () => {
    const [FFMinputFiles, input, filter, mapping, output, outputType] =
      generateCommand();
    LoadCommand();

    const ffmpeg = ffmpegRef.current;
    console.log("generating");

    for (let i = 0; i < FFMinputFiles.length; i++) {
      const file = FFMinputFiles[i];
      const videoFile = await fetchFile(file);
      await ffmpeg.writeFile(file.name, videoFile);
      console.log(`wrote file: ${file.name}`);
      console.log(file);
    }
    const TokenizedCommand = TokenizeString(
      "-y" + input + " " + filter + " -t 3 " + mapping + " " + output
    );
    console.log(TokenizedCommand);

    try {
      await ffmpeg.exec(TokenizedCommand);
    } catch (error) {
      console.error("Error executing ffmpeg command:", error);
    }

    const fileData = await ffmpeg.readFile(output);
    const fileBlob = new Blob([fileData.buffer], { type: outputType });
    const finalSource = URL.createObjectURL(fileBlob);
    console.log(fileBlob.type);
    setSource(finalSource);
    setSourceType(outputType);
  };

  const inlineInputStyle = {
    display: "inline",
    width: "40%",
    height: "20%",
    whiteSpace: "nowrap",
    margin: "0 0",
  };
  return (
    <div
      style={{
        justifyContent: "center",
        width: "260px",
        fontFamily: "monospace",
      }}
      className="react-flow__node-default"
    >
      <button onClick={LoadCommand}>generate command</button>
      <div
        style={{
          backgroundColor: "#000",
          fontFamily: "monospace",
          fontSize: "smaller",
          margin: "5px",
          position: "relative",
          maxHeight: "150px",
          overflowY: "scroll",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <button
          onClick={CopyCommandToClipboard}
          style={{
            position: "absolute",
            height: "40px",
            width: "40px",
            top: "0px",
            left: "0px",
            backgroundColor: "#abc1",
            border: 0,
          }}
        >
          <CopyIcon
            fill={TextCoppied ? "#000" : "#FFF"}
            viewBox={"0 0 24 24"}
            width="30px"
          />
        </button>
        <br />
        <span style={{ color: "#FFFFFF" }}>ffmpeg </span>
        <br />
        <span style={{ color: "#FDFDCB" }}>{FFMinput}</span>
        <br />
        <span style={{ color: "#90D7FF" }}>{FFMfilter}</span>
        <br />
        <span style={{ color: "#C9F90F" }}>{FFMmap} </span>
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            style={inlineInputStyle}
            placeholder="outfile"
            onChange={(e) => {
              setOutfile(e.target.value ? e.target.value : "outfile");
            }}
            type="text"
          />
          <select
            style={inlineInputStyle}
            onChange={(e) => {
              setSelectedMimeType(e.target.value);
              console.log(e.target.value);
            }}
          >
            <option value="video/mp4">.mp4</option>
            <option value="video/webm">.webm(vid)</option>
            <option value="video/mpeg">.mpeg</option>
            <option value="image/jpeg">.jpg</option>
            <option value="image/jpeg">.jpeg</option>
            <option value="image/png">.png</option>
            <option value="image/webp">.webp(img)</option>
            <option value="audio/mpeg">.mp3</option>
            <option value="audio/wav">.wav</option>
          </select>
        </div>
      </div>

      <br />
      {loaded && <button onClick={GenerateVideo}>generate a clip</button>}
      {!StartedLoading && (
        <button onClick={initalizeFFm}>click to load FFMpeg</button>
      )}

      <div
        style={{
          backgroundColor: "#000",
          fontFamily: "monospace",
          fontSize: "smaller",
          margin: "5px",
          position: "relative",
          maxHeight: "150px",
          overflowY: "scroll",
          padding: "10px",
          borderRadius: "5px",
          color: "#FFF",
        }}
      >
        {messages.map((message) => (
          <>
            <p>{message}</p>
            <hr />
          </>
        ))}
      </div>

      <MediaDisplay
        src={source}
        type={sourceType}
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />

      <DivHandle
        type="target"
        id="1"
        mediaType={MediaTypes.VIDEO}
        position={Position.Left}
        style={{
          top: "33%",
          backgroundColor: !selectedMimeType.startsWith("a") ? "#bfb" : "#fbb",
        }}
      />
      <DivHandle
        type="target"
        id="2"
        mediaType={MediaTypes.AUDIO}
        position={Position.Left}
        style={{
          top: "66%",
          backgroundColor: !selectedMimeType.startsWith("i") ? "#bfb" : "#fbb",
        }}
      />
    </div>
  );
}
