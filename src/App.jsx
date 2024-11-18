import  './index.css';
import {  ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {InitalNodes, nodeTypes} from "./nodes/index.jsx";

function Sidebar(){
    return(
<div className="sidebar">
    <h1>Delta Frame</h1>
    <hr></hr>
    </div>
    )}

function Body() {
    
    return(
    <div className='body'>
<ReactFlow nodes={InitalNodes} nodeTypes={nodeTypes} edges = {[]}> </ReactFlow>

</div>)
}
//<div className='Body'></div>



    
 
export default function App() {
   return <>
         <Sidebar /> 
         <Body />
        </>
}