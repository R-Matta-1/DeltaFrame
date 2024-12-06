import { Position, Handle, useHandleConnections } from "@xyflow/react";
import {useCallback, useState} from "react";

const MediaTypes = {
    VIDEO:"video",
    AUDIO:"audio"
}

function DivHandle(params) {
    const divStyle = {
        border:"solid black 1px" , 
        zIndex:-1,
        position:"absolute",
        width:"10px",
        height:"10px",
        top:"-2.5px",
        font: "8px  Verdana black"

    }
    if(params.position === Position.Left){
        divStyle.left ="-15px"
    } else {
        divStyle.right="-15px"
    }
    if(params.type === "target"){
        divStyle.backgroundColor ="#fcf"
    } else {
        divStyle.backgroundColor="#cfc"
    }

    return<>
    <Handle style={{zIndex:"100000"}} {...params}>
        <div style={divStyle} 
                >
                    {(params.mediaType == MediaTypes.VIDEO)?"V":null}
                    {(params.mediaType == MediaTypes.AUDIO)?"A":null}

                </div>
    </Handle>
    </>}

function VideoOutput({x,y,Data}) {
   
    return(
    <div style={{ justifyContent:"center", width:"360px" ,height: "175px"}}  className="react-flow__node-default">
       
    <video controls src="https://upload.wikimedia.org/wikipedia/commons/d/d9/177_day_spin_up_zonal_velocity.webm" ></video>

    <DivHandle type="target" mediaType = {MediaTypes.VIDEO} id="input" position= {Position.Left}  style={{top:"33%"}}  />
    <DivHandle type="target" mediaType = {MediaTypes.AUDIO} id="input" position= {Position.Left}  style={{top:"66%"}}  />
</div>
    )
}

function VideoDifference({x,y,Data}) {
   return( <>
    <div style= {{height: "20%", padding:"0"}} className="react-flow__node-default">
    <p style={{font:"15px Verdana"}}>Difference</p>
   
<DivHandle type="target" id="Input1" position= {Position.Left} mediaType = {MediaTypes.VIDEO} style={{top:"75%"}}  />

<DivHandle type="target" id="Input2" position= {Position.Left} mediaType = {MediaTypes.VIDEO} style={{top:"25%"}} />

<DivHandle type="source" id="Output" position= {Position.Right} mediaType = {MediaTypes.VIDEO}   />

</div></>)
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
    
    
    <DivHandle type="source" id={"VideoOutput"} position= {Position.Right} style={{top:"33%"}} mediaType = {MediaTypes.VIDEO} />
    <DivHandle type="source" id={"audioOutput"} position= {Position.Right} style={{top:"66%"}} mediaType = {MediaTypes.AUDIO}  />
    </div>)
}



export const nodeTypes  = {
    "Output":VideoOutput,
    "Difference":VideoDifference,
    "Input":VideoInput
}

/// THis should be the ONLY place where the names are hardcoded
export const  InitalNodes = [
    { id: "a", type: "Input", position: { x: 10, y: 50 }, data: { }},
    { id: "d", type: "Input", position: { x: 10, y: 270 }, data: { }},
    { id: "b", type: "Difference", position: { x: 365, y: 150 }, data: { }},
    { id: "c", type: "Output", position: { x: 370, y: 390 }, data: { }},
]
