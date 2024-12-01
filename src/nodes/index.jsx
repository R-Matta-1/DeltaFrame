import { Position, Handle, useHandleConnections } from "@xyflow/react";
import {useCallback, useState} from "react";

//TODO: custom fowarding,(involving the fowarding of videos for the workflow) 

//TODO: find example of foward string 
//TODO: simple video creation

function VideoOutput({x,y,Data}) {
   
    return(
        <div style={{ justifyContent:"center", width:"360px" ,height: "175px"}}  className="react-flow__node-default">
           
       <video controls src="https://upload.wikimedia.org/wikipedia/commons/d/d9/177_day_spin_up_zonal_velocity.webm" ></video>

       
        
       <p className="NodeHandleLable" style={{left:"5%",top:"25%" }} >Input</p>
       <Handle
            type="target" 
            id="input"
            onConnect = {(prop) => {console.log(prop)}}
            position= {Position.Left} 
            connectionCount= {1}
            style={{top:"25%"}} 
            />
</div>
    )
}

function VideoDifference({x,y,Data}) {
   return( <div style= {{height: "50%"}} className="react-flow__node-default">
    <p>Difference</p>

    <p className="NodeHandleLable" style={{left:"5%",top:"50%", position:"absolute"}} >Video In</p>
<Handle type="target" id="Input1" position= {Position.Left} style={{top:"75%"}} ></Handle>

    <p className="NodeHandleLable" style={{left:"5%",top:"5%"}} >Video In</p>
<Handle type="target" id="Input2" position= {Position.Left} style={{top:"25%"}} ></Handle>


    <p className="NodeHandleLable" style={{right:"5%",top:"25%", }} >Output</p>
<Handle type="source" id="Output" position= {Position.Right}  ></Handle>
</div>)
}

function VideoInput() {
    const [VideoLink,ChangeVideoLink] = useState('https://media.istockphoto.com/id/1413207061/video/road-traffic-in-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=KnGos4ZVgHxZSV-zGAJk0mWsjR2kLGumoVcKI-PanEw=')
    
    function RedirectClick(e) {
        const HiddenInput = e.target.querySelector("input");
        if (HiddenInput) {
            HiddenInput.click()
        }
    }
    function InputAdition(e) {
        const InputVideoURL = URL.createObjectURL(e.target.files[0])
        ChangeVideoLink(InputVideoURL)
    }
    return(
    <div 
        style= {{ justifyContent:"center", width:"300px" ,height: "175px"}} 
        className="react-flow__node-default"
    >
       
    <video
        controls  src={VideoLink}>
    </video>

    <div 
            onClick={(e) =>{RedirectClick(e)}}  
            style={{height:"20px",bottom:"-50px",backgroundColor:'#bbd'}}
    >
            <p>Click To Input</p>
    <input 
        hidden 
        onChange={(e)=>{InputAdition(e)}}  
        type="file" 
        className="videoInput" 
        accept="video/*"  />
        
    </div>
    
    
    <Handle type="source" position= {Position.Right} style={{top:"50%"}} ></Handle>
    </div>)
}



export const nodeTypes  = {
    "VideoOutput":VideoOutput,
    "VideoDifference":VideoDifference,
    "VideoInput":VideoInput
}

export const  InitalNodes = [
    { id: "a", type: "VideoInput", position: { x: 10, y: 50 }, data: { }},
    { id: "d", type: "VideoInput", position: { x: 10, y: 270 }, data: { }},
    { id: "b", type: "VideoDifference", position: { x: 365, y: 150 }, data: { }},
    { id: "c", type: "VideoOutput", position: { x: 370, y: 390 }, data: { }},
]
