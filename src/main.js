const FakeConsole = document.getElementById("trash")

const EdgeCreationToggleBtn = document.getElementById("EdgeCreationToggleBtn");
const mouseFollowerNodeId = `MouseFollower${Math.random()}`

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
 
  
var SelectedNode = null;
  cy.on("cxttap", "node", function(evt) {
    CurrentNode = evt.target

    if (SelectedNode == null) {
        // if thier is no previously selected node, make that this node
        BeginEdgeSelection(CurrentNode,evt.position.x,evt.position.y)
        return;
    }
    if (SelectedNode.id() != CurrentNode.id() &&
        cy.elements(`edge[source = "${SelectedNode.id()}"][target = "${CurrentNode.id()}"]`).length == 0 &&
        cy.elements(`edge[source = "${CurrentNode.id()}"][target = "${SelectedNode.id()}"]`).length == 0) {
        // thier IS a node, if we are not looping it  AND thier is no identicle edge, create the edge

        cy.add({
            group: "edges",
            data: {
                source: SelectedNode.id(),
                target: CurrentNode.id()
            }
        })
        console.log('connection from:  ' + SelectedNode.id() + " to" + CurrentNode.id());
		EndEdgeSelection()

    }
})

cy.on("cxttap" , "edge"  , function(evt){
  cy.remove(evt.target)
})
  
  
document.addEventListener('click',function(event){
  console.log("click")
  EndEdgeSelection()
})

function CreateNode(){ // add custom name, custom metadata
  nodeId = document.getElementById("node-Name").value

 nodeId = makeUniqueID(nodeId)

    cy.add({
    data:{id:nodeId}, // unique id
    position:averageGridCenter()
   }) //position =  average pos of all obj
}

function makeUniqueID(IDBase) {
  return (cy.$id(IDBase).length ==0)? IDBase : makeUniqueID(IDBase+" ")//todo
}

function BeginEdgeSelection(node,x,y) {
	SelectedNode = node;
        console.log("node selected: " + SelectedNode.id())

		cy.add({group:"nodes", 
			data:{id:mouseFollowerNodeId },style:{ visibility: 'hidden'},
			position:{x:x , y:y},
			
		})

		cy.add({group:"edges",
       data:{
        source: SelectedNode.id(), 
        target: mouseFollowerNodeId}})


		cy.on("vmousemove" , function (evt) {
			console.log("move")
			if (cy.nodes(`[id = "${mouseFollowerNodeId}"]`).length !=0) {
				cy.nodes(`[id = "${mouseFollowerNodeId}"]`).position({x:evt.position.x , y:evt.position.y})
			}
		})
}
function EndEdgeSelection(){
	console.log("SelectedNode reset")
	SelectedNode = null
	cy.remove(`node[id = "${mouseFollowerNodeId}"]`);
	cy.remove(`edge[target = "${mouseFollowerNodeId}"]`);
	cy.removeListener("vmousemove")
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