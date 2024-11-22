import  './index.css';
import { applyNodeChanges ,applyEdgeChanges, ReactFlow, useEdgesState, useNodesState, addEdge, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {InitalNodes, nodeTypes} from "./nodes/index.jsx";
import { useState, useCallback } from 'react';

function Sidebar(){
    return(
<div className="sidebar">
    <h1>Delta Frame</h1>
    <hr></hr>
    </div>
    )}





    
 
export default function App() {
    const [nodes, setNodes] = useNodesState(InitalNodes);
    const [edges, setEdges] = useEdgesState([]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
      );
      const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
      );
     const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params,eds))
     )

     const onDragOver = (event) =>{ /// todo: error here, find more about
       console.log(screenToFlowPosition({x: event.clientX,y:event.clientY}))
     } 
   return <>
         <Sidebar /> 

         <div className='body'>
<ReactFlow  
    nodes={nodes} 
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    nodeTypes={nodeTypes}
     edges = {edges}
     onDragOver={(e)=>{onDragOver(e)}}
     fitView
 > </ReactFlow>
        </div>
        </>
}