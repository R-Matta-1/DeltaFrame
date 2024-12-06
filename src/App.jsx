import  './index.css';
import { applyNodeChanges
	 ,applyEdgeChanges,
	 Background, 
	 ReactFlow, 
	 useEdgesState, 
	 useNodesState, 
	 addEdge, 
	 useReactFlow, 
	 ReactFlowProvider, 
	 Position } from '@xyflow/react';
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
	<div 
		draggable 
		key={keys.keys} 
		onDragStart = {(e)=>{props.onNodeDrag(e,{keys})}} 
		className= "DraggingDiv">

<h4 className='NodeName'>{keys}</h4>

<hr ></hr>

	</div>
))}
    </div>
    )}
    
 
 function App() {
    const [nodes, setNodes] = useNodesState(InitalNodes);
    const [edges, setEdges] = useEdgesState([]);
    const [DraggedType, setDraggedType] =useState("");
    const {screenToFlowPosition, getNodes, getEdges } = useReactFlow()

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
      );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => {applyEdgeChanges(changes, eds)}),
        [],
      );
	  
     const onConnect = useCallback(
        (newEdg) => {
          const newEdges = edges.concat(newEdg);
          const repeatedTargetEdges = newEdges.filter((eds)=>{return eds.targetHandle == newEdg.targetHandle && eds.target == newEdg.target})
          console.log(repeatedTargetEdges.length)
          if (repeatedTargetEdges.length > 1) {
            console.log("more then edge targeting this HANDLE")            
         } else {
          setEdges((eds) => addEdge(newEdg,eds))
         }
        })

    const onNodeDrag = (event,keys) =>{
		console.log("drag: "+keys.keys)
		setDraggedType(keys.keys)
    }

    const onDragOver = (event) =>{
    
      event.preventDefault();
      console.log(DraggedType)
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
      
      if(nodeAtSamePosition.length == 0 && DraggedType in nodeTypes){ // solves double action problem
        setNodes((nds) => nds.concat(newNode));
      }
    };

	const onNodeDragStop = (event, node, nodes) => {
		const MouseOnSidebar = event.clientX / window.innerWidth < 0.2 ; 
		console.log( event.clientX / window.innerWidth)
		if(MouseOnSidebar){
			setNodes(getNodes().filter(nds => nds.id != node.id))

		}
	
	}

	const onEdgeClick =(event,edge) =>{
			setEdges(getEdges().filter(edg => edg.id != edge.id))
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
	onEdgeClick = {onEdgeClick}
    fitView 
 >
	<Background/>
	 </ReactFlow>
        </div>
        </>
        
)}

export default function(){
return <ReactFlowProvider>
  <App />
</ReactFlowProvider>
}