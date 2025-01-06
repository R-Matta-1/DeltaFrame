import "./index.css";
import {
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  getOutgoers,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { InitalNodes, nodeTypes, MediaTypes } from "./nodes/index.jsx";
import { useState, useCallback } from "react";

let id = 0;
const origionalId = () => `I${id++}`;

function Sidebar(props) {
  return (
    <div className="sidebar">
      <h1>FFmpeg Generator</h1>
      <hr />
      <div className="NodeHolder">
        {Object.entries(nodeTypes).map(([keys]) => (
          <div
            draggable
            key={keys.keys}
            onDragStart={(e) => {
              props.onNodeDrag(e, { keys });
            }}
            onTouchStart={(e) => {
              props.onNodeDrag(e, { keys });
            }}
            className="DraggingDiv"
          >
            <h4 className="NodeName">{keys}</h4>

            <hr></hr>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [nodes, setNodes] = useNodesState(InitalNodes);
  const [edges, setEdges] = useEdgesState([]);
  const [DraggedType, setDraggedType] = useState("");
  const { screenToFlowPosition, getNodes, getEdges } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        applyEdgeChanges(changes, eds);
      }),
    []
  );

  const onConnect = useCallback((newEdge) => {
    const newEdges = edges.concat(newEdge);

    const repeatedTargetEdges = newEdges.filter((eds) => {
      return (
        eds.targetHandle == newEdge.targetHandle && eds.target == newEdge.target
      );
    });
    console.log(repeatedTargetEdges.length);

    if (repeatedTargetEdges.length > 1) {
      console.log("already another edge else with this as a targert");
      return;
    }

    for (let i = 0; i < newEdges.length; i++) {
      let edge = newEdges[i];
      let edgeSourceMedia = edge.sourceHandle.substring(0, 4);
      let edgeTargetMedia = edge.targetHandle.substring(0, 4);

      if (edgeTargetMedia != edgeSourceMedia) {
        return;
      }
      if (edge.source == edge.target) {
        return;
      }
    }

    setEdges((eds) => addEdge(newEdge, eds));
  });

  const onNodeDrag = (event, keys) => {
    console.log("drag: " + keys.keys);
    setDraggedType(keys.keys);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    console.log(DraggedType);
  };

  const onDrop = (event) => {
    console.log("AAAAAAAAAAAAAAAAA");
    console.log(event);
    event.preventDefault();
    let foundX = 0;
    let foundY = 0;
    if (event.clientX) {
      foundX = event.clientX;
      foundY = event.clientY;
    } else {
      foundX = event.changedTouches[0].clientX;
      foundY = event.changedTouches[0].clientY;
    }

    const newPosition = screenToFlowPosition({
      x: foundX,
      y: foundY,
    });

    const newNode = {
      id: origionalId(),
      type: DraggedType,
      position: newPosition,
    };

    const nodeAtSamePosition = getNodes().filter(
      (node) =>
        node.position.x == newPosition.x && node.position.y == newPosition.y
    );

    if (nodeAtSamePosition.length == 0 && DraggedType in nodeTypes) {
      // solves double action problem
      setNodes((nds) => nds.concat(newNode));
    }
    setDraggedType("");
  };

  const onNodeDragStop = (event, node, nodes) => {
    const PixelsInputX = event.clientX
      ? event.clientX
      : event.changedTouches[0].clientX;

    const MouseOnSidebar = PixelsInputX < 105;
    console.log(event.clientX / window.innerWidth);
    if (MouseOnSidebar) {
      setNodes(getNodes().filter((nds) => nds.id != node.id));
      setEdges(
        getEdges().filter(
          (edg) => edg.source != node.id && edg.target != node.id
        )
      );
    }
  };

  const onEdgeClick = (event, edge) => {
    setEdges(getEdges().filter((edg) => edg.id != edge.id));
  };

  const isValidConnection = useCallback(
    (connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const hasCycle = (node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target.id === connection.source) return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  return (
    <>
      <Sidebar onNodeDrag={onNodeDrag} />

      <div className="body">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edges={edges}
          onDropCapture={onDrop}
          onDrop={onDrop}
          onTouchEndCapture={onDrop}
          onDragOver={onDragOver}
          autoPanOnNodeDrag={false}
          onNodeDragStop={onNodeDragStop}
          onEdgeClick={onEdgeClick}
          isValidConnection={isValidConnection}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
    </>
  );
}

export default function () {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
