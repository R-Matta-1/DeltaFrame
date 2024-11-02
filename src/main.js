const EdgeCreationToggleBtn = document.getElementById("EdgeCreationToggleBtn");
const mouseFollowerNodeId = `MouseFollower${Math.random()}`
const NameInputBox = document.getElementById("node-Name");

var cy = cytoscape({
    container: document.getElementById('cy'), // container to render in
    elements: [ // list of graph elements to start with
      {data: { id: 'Start' }, style:{backgroundColor:"#D81E5B", shape:"hexagon"}}, //node
      {data: { id: 'Final' }, style:{backgroundColor:"#D81E5B", shape:"hexagon"}}, //node
      {data: { id: 'ab', source: 'Start', target: 'Final' }} // edge
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

    layout: { name: 'grid', rows: 1}
  });
  // selection box is a useless eye sore (unless I think of a use then it's just an eyesore)
  cy.boxSelectionEnabled(false)
 
  

  
  function CreateNode(){ // add custom name, custom metadata
  nodeId = NameInputBox.value

 nodeId = makeUniqueID(nodeId)

    cy.add({
    data:{id:nodeId}, // unique id
    position:averageGridCenter()
   }) //position =  average pos of all obj
}

function makeUniqueID(IDBase) {
      //if the dose not already exist, it's valid, else, add a space and repeat
      return (cy.$id(IDBase).length ==0)? IDBase : makeUniqueID(IDBase+" ")
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

cy.on('tap',function(event){
if (event.target === cy) {
console.log("tapped cy (backround)")
 	KillEdgeSelectors()
 } else {
    return
  }})

cy.on('tap',"node",function(event){
console.log(`node tap of: ${event.target.id()}`)
    })

cy.on('tap',"edge",function(event){
console.log(`edge tap of: ${event.target.id()}`)


})



////everything relating to the right click 
cy.on("cxttap" , "edge"  , function(evt){
	cy.remove(evt.target)
	})
//////////
///Right click node focuse that selects edges and creates effect
//////////

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

