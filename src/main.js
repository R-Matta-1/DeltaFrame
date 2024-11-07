
var cy = cytoscape({
	container: document.getElementById('cy'), // container to render in
	elements: [ // list of graph elements to start with
//	  {data: { id: 'Start' }, style:{backgroundColor:"#D81E5B", shape:"hexagon"}}, //node
//	 {data: { id: 'Final' }, style:{backgroundColor:"#D81E5B", shape:"hexagon"}}, //node
//	  {data: { id: 'ab', source: 'Start', target: 'Final' }} // edge
	],
  style: [ {
		selector: 'node',
		style: {
		  'background-color': '#666',
		  'label': 'data(id)'
		} },
	  {
		selector: 'edge',
		style: { 
		  'width': 4,
		  'line-color': '#aaa',
		  'target-arrow-color': '#444',
		  'target-arrow-shape': 'triangle',
		  'curve-style': 'bezier'
		}
	  }],
  
	layout: { name: 'grid', rows: 2}
  });
  cy.style()
  .selector('node.focused')
  .style({
    'border-width': '3px',
    'border-color': '#a3f',
    'border-style': 'solid',
    'border-opacity': 1,
	
  })
  .update();


  cy.style()
  .selector('node.display')
  .style({
    'background-color': '#ED254E'
  })
  .update();

cy.style()
  .selector('node.functional')
  .style({
    'background-color': '#F9DC5C'
  })
  .update();

cy.style()
  .selector('node.operator')
  .style({
    'background-color': '#011936'
  })
  .update();

cy.style()
  .selector('node.input')
  .style({
    'background-color': '#465362'
  })
  .update();

  // selection box is a useless eye sore (unless I think of a use then it's just an eyesore)
  cy.boxSelectionEnabled(false)
  
  
  
  
  function makeUniqueID(IDBase) {
	  //if the dose not already exist, it's valid, else, add a space and repeat
	  if(cy.$id(IDBase).length ==0){
		return IDBase
	  } else {
		return makeUniqueID(IDBase+" ")}
	}
  
  
  averageGridCenter = () => {
  for (let i =0 ; i < cy.nodes().length; i++){
	console.log(cy.nodes()[i].position("x"))
  }
  let avgX =0;
  let avgY =0;
  
  cy.nodes().forEach(element => {
	avgX += element.position().x;
	avgY += element.position().y;
  });
  let length  = cy.nodes().length;
  
  avgX /= length;
  avgY /= length;
  
  return {x:avgX , y:avgY-50}
  }
  
  ////////////
  //// regular click zone
  ////////////
  var FocusNodeid = "";
  
  cy.on('tap',function(event){
  if (event.target === cy) {
  console.log("tapped cy (backround)")
   KillEdgeSelectors();

	cy.$id(FocusNodeid).removeClass("focused");
	FocusNodeid = "";
	
	SetDisplayData(DefaultNodeData);
  } else {
	return
  }
  })
  
  cy.on('tap',"node",function(event){

	cy.$id(FocusNodeid).removeClass("focused");

	FocusNodeid = event.target.id();

	cy.$id(FocusNodeid).addClass("focused");


	console.log(`node tap of: ${FocusNodeid}`)
	SetDisplayData(GetNodeData(FocusNodeid))
  })
  
  cy.on('tap',"edge",function(event){
	console.log(`edge tap of: ${event.target.id()}`)
  })
  ///////////
  /// Get / Set node Data
  //////////
  
  var ActionType = {
  Undefined: "",
  Functional:	'functional',
  Display: 		'display',
  Input: 		'input',
  Operator: 	'operator'
  };
  
  const OperatorType = {
  Undefined:'',
  Max:"Max",
  Min:"Min",
  Avg:"Avg",
  Add:"Add",
  Mul:"Mult",
  }
  const FunctionType = {
  Undefined:'',
  Filter		 	:"Filter" ,
  Invert		 	:"Invert" ,
  RemoveColor	 	:"RemoveColor" ,
  Tint		 	:"Tint" ,
  TranslateTime 	:"TranslateTime" ,
  TranslateSpace 	:"TranslateSpace" ,
  Speed		 	:"Speed" ,
  }
  /// alll input fields 
  const NameInputBox		 = document.getElementById("node-Name");
  const VideoInput 		 = document.getElementById("videoInput");
  const NodeActionInput 	 = document.getElementById("Type");
  const NodeFunctionInput  = document.getElementById("functionOptions");
  const NodeOperationInput = document.getElementById("Operations");
  
  
  // all storage boxes
  const InputDataBox 		= document.getElementById("nodeInput");
  const DisplayDataBox 	= document.getElementById("nodeDisplay");
  const FunctionDataBox 	= document.getElementById("nodefunction");
  const OperatorDataBox 	= document.getElementById("nodeOperation");
  
 // VideoInput.addEventListener("cha")

function UpdateNodeClass(NodeId) {
	Node = cy.$id(NodeId)
	Node.removeClass(ActionType.Display);
	Node.removeClass(ActionType.Functional);
	Node.removeClass(ActionType.Input);
	Node.removeClass(ActionType.Operator);
	Node.addClass(GetNodeData(NodeId).Action)
}


  NodeActionInput.addEventListener("input" , updateSidebarAction); 
  NameInputBox.addEventListener("input" ,() =>{SetNodeDataFromDisplay(FocusNodeid)}); 
  

  VideoInput 		.addEventListener("input",()=>{SetNodeDataFromDisplay(FocusNodeid)})
  NodeFunctionInput .addEventListener("input",()=>{SetNodeDataFromDisplay(FocusNodeid)})
  NodeOperationInput.addEventListener("input",()=>{SetNodeDataFromDisplay(FocusNodeid)})




  function updateSidebarAction(){
  SetNodeDataFromDisplay(FocusNodeid)



  InputDataBox.hidden	  =true;
  DisplayDataBox.hidden	=true;
  FunctionDataBox.hidden=true;
  OperatorDataBox.hidden=true;
  
  let newValue = NodeActionInput.value;
  switch (newValue) {
	case ActionType.Functional:
	  FunctionDataBox.hidden=false;
	  break;
  
	case ActionType.Display:
	  DisplayDataBox.hidden =false;
	  break;
  
	case ActionType.Input:
	  InputDataBox.hidden	  = false;
	  break;
  
	case ActionType.Operator:
	  OperatorDataBox.hidden=false;
	break;
	default:
	  console.log("defualt or unacounted value")
	  break;
  }
  
  }
  
  // in the event no node is focused on,
  // this data should be displayed
  
  class NodeScratchData {
  constructor(Id,
			Action = ActionType.Undefined,
		   VideoLink = "" ,
	  VideoOutput = "",
	  Function = FunctionType.Undefined,
	  FunctionParams = "",
	  Operation = OperatorType.Undefined,	
	  ) {
  
  this.Id				= Id;
  this.Action			= Action;
  this.VideoLink 		= VideoLink ;
  this.VideoOutput	= VideoOutput;
  this.Function		= Function;
  this.FunctionParams	= FunctionParams;
  this.Operation		= Operation;
  }
  }
  var DefaultNodeData = new NodeScratchData("");
  

  
  // would work to run ShowNodeData(GetNodeData) 
  function SetDisplayData(NodeData) {

	NameInputBox.value = NodeData.Id
	NodeActionInput.value = NodeData.Action
	VideoInput.value = NodeData.VideoLink //define later
   NodeFunctionInput.value = NodeData.Function // add func params
  NodeOperationInput.value = NodeData.Operation
 updateSidebarAction() 
  }
  
  function GetNodeData(NodeId) {
  if (NodeId == "") {
	return DefaultNodeData;
  }
  
  if(cy.$id(NodeId).length != 0 ){
	
	return  cy.$id(NodeId).scratch("NodeScratchData")
	
  } else {
	console.log("node D.N.E.")
  }
  
  return DefaultNodeData;
  }
  
  function GetDisplayData() {
  return new NodeScratchData(	
	NameInputBox.value,
	NodeActionInput.value,
	VideoInput.value, "" ,
	NodeFunctionInput.value,
	"", // function paramaters
	NodeOperationInput.value)
  }
  
  function SetNodeDataFromDisplay(NodeId) {
 Node = cy.$id(NodeId);

	if(Node.length != 0 ){

  let	NewData = GetDisplayData()
  
  
  Node.scratch("NodeScratchData", NewData)
  NameInputBox.value = NodeId
  
  UpdateNodeClass(NodeId)
  }}
  
  
function CreateNode(NodeData , position){ // add custom name, custom scratch
	if (typeof position === 'undefined'){
	  position = averageGridCenter()
	}
  
   NodeData.Id = makeUniqueID(NodeData.Id)
  
	cy.add({ // ALTER SCRATCH
	data:{id: NodeData.Id },
	position:  position 
  }) 
  cy.$id( NodeData.Id).scratch("NodeScratchData",NodeData)
  cy.$id( NodeData.Id).addClass(NodeData.Action)
  SetDisplayData(DefaultNodeData)
  }
  
function CreateNodeFromDisplayData() {
	CreateNode(GetDisplayData());
  }

  var StartNodeData = new NodeScratchData(
	"Start",
	ActionType.Input,"","",
	FunctionType.Undefined,"",
	OperatorType.Undefined)
  
  CreateNode(StartNodeData,  {x: cy.width()/2 , y:cy.height()/4 })
  
  var EndNodeData = new NodeScratchData(
	"Final",
	ActionType.Display, "","",
	FunctionType.Undefined,"",
	OperatorType.Undefined)
  
  CreateNode(EndNodeData, {x: cy.width()/2 , y:cy.height()*3/4 })

  cy.add({group:"edges",
	data:{
	 source: "Start", 
	 target: "Final"}
 })
  
  ///////////
  ////everything relating to the right click 
  ///////////
  
  cy.on("cxttap" , "edge"  , function(evt){
  cy.remove(evt.target)
  })
  //////////
  ///Right click node focuse that selects edges and creates effect
  //////////
  const mouseFollowerNodeId = `MouseFollower${Math.random()}`
  
  var Right_Focuse_Node_Id = ""
  
  cy.on("cxttap", "node", function(evt) {
  let CurrentNode = evt.target
  
  if (Right_Focuse_Node_Id == "") {
	// if thier is no previously selected node, make that this node
		Right_Focuse_Node_Id = CurrentNode.id()
		// add an invisible node that always follows the mouse
		cy.add(
		{group:"nodes", 
		data:{id:mouseFollowerNodeId },
		style:{ visibility: 'hidden'},
		position: evt.position,
	  })
  
	  //add a visible node that is connected
	  cy.add({group:"edges",
		 data:{
		  source: CurrentNode.id(), 
		  target: mouseFollowerNodeId}
	  })
  
	  cy.on("vmousemove" , function (evt) {
		
		if (cy.nodes(`[id = "${mouseFollowerNodeId}"]`).length !=0) {
		  cy.nodes(`[id = "${mouseFollowerNodeId}"]`).position(evt.position)
		}
	  })
  
  return;
  }
  
  // if thier is a node in Right_Focuse_Node_Id this will run
  
  if (Right_Focuse_Node_Id != CurrentNode.id() && 
	cy.elements(`edge[source = "${Right_Focuse_Node_Id}"][target = "${CurrentNode.id()}"]`).length == 0 &&
	cy.elements(`edge[source = "${CurrentNode.id()}"][target = "${Right_Focuse_Node_Id}"]`).length == 0) {
	// thier IS a node, if we are not looping it  AND thier is no identicle edge, create the edge
  
	// a ctually creating the edge
	cy.add({
	  group: "edges",
	  data: {
		source: Right_Focuse_Node_Id,
		target: CurrentNode.id()
	  }
	})
  
	// reset evrything to red
  KillEdgeSelectors()
  
  }
  })
  
  function KillEdgeSelectors() {
		  Right_Focuse_Node_Id = "";
	cy.remove(`node[id = "${mouseFollowerNodeId}"]`);
	cy.remove(`edge[target = "${mouseFollowerNodeId}"]`);
	cy.removeListener("vmousemove")
  }
  
  