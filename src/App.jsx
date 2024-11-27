import  './index.css';
import { applyNodeChanges ,applyEdgeChanges, ReactFlow, useEdgesState, useNodesState, addEdge, useReactFlow, ReactFlowProvider, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {InitalNodes, nodeTypes} from "./nodes/index.jsx";
import { useState, useCallback } from 'react';

let id = 0;
const origionalId = () => `NodeId:${id++}`;

function Sidebar(props){
    return(
<div className="sidebar">
    <h1>Delta Frame</h1>
    <hr />
{Object.entries(nodeTypes).map(([keys,])=>(
  <div draggable key={keys.keys} onDragStart = {(e)=>{props.onNodeDrag(e,{keys})}} className= "DraggingDiv"> {keys} </div>
))}
    </div>
    )}
    
 
 function App() {
    const [nodes, setNodes] = useNodesState(InitalNodes);
    const [edges, setEdges] = useEdgesState([]);
    const [DraggedType, setDraggedType] =useState("");
    const {screenToFlowPosition,getNodes } = useReactFlow()

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

     const onNodeDrag = (event,keys) =>{
      
console.log("drag: "+keys.keys)
setDraggedType(keys.keys)
     }

     const onDragOver = (event) =>{
    
      event.preventDefault();
      console.log("Over")
     }
     const onDrop = (event) => {
      event.preventDefault();

    const newPosition = screenToFlowPosition({x:event.clientX, y:event.clientY })

      const newNode = {
        id:origionalId(),
        type:DraggedType,
        position:newPosition
      }

	const nodeAtSamePosition = getNodes().filter(
        node => node.position.x == newPosition.x && node.position.y == newPosition.y
	)
      
      if(nodeAtSamePosition.length == 0){ // solves double action problem
        setNodes((nds) => nds.concat(newNode));
      }
      console.log(getNodes())
      
   
    };

	const onNodeDragStop = (event, node, nodes) => {
		console.log(event.view);
	// delete the node if the courser is on the sidebar

	}
   return (
   <>
         <Sidebar onNodeDrag = {onNodeDrag} /> 

         <div  className='body'>
<ReactFlow  
    nodes={nodes} 
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    nodeTypes={nodeTypes}
    edges = {edges}
    onDropCapture={(e)=>{onDrop(e)}}
    onDrop ={onDrop}
    onDragOver ={onDragOver}
	autoPanOnNodeDrag = {false}
	onNodeDragStop = {onNodeDragStop}
    fitView

   
    
 > </ReactFlow>
        </div>
        </>
        
)}

export default function(){
return <ReactFlowProvider>
  <App />
</ReactFlowProvider>
}