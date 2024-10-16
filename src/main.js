const FakeConsole = document.getElementById("trash")

const EdgeCreationToggleBtn = document.getElementById("EdgeCreationToggleBtn");
var uniqueIdNumber=0
var EdgeCreationMode = false

var cy = cytoscape({
    container: document.getElementById('cy'), // container to render in
    elements: [ // list of graph elements to start with
      {data: { id: 'Start' }}, //node
      {data: { id: 'Final' }}, //node
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
          'width': 3,
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
  // when on EdgeCreationMode sleecting a node should create an invisible node that follows the mouse until released unto another node
cy.on("cxttap" , "node"  , function(evt){
  CurrentNode = evt.target

  if (SelectedNode == null) { 
    // if thier is no previously selected node, make that this node
    SelectedNode = CurrentNode;
    console.log("node selected: "+SelectedNode.id())
    return;
  } 
   if( SelectedNode.id() !=CurrentNode.id()  
   && cy.elements(`edge[source = "${SelectedNode.id()}"][target = "${CurrentNode.id()}"]`).length == 0
  &&  cy.elements(`edge[source = "${CurrentNode.id()}"][target = "${SelectedNode.id()}"]`).length == 0){ 
    // thier IS a node, if we are not looping it  AND thier is no identicle edge, create the edge
  
        cy.add({group:"edges" ,
          data:{
            source:SelectedNode.id(),
            target:CurrentNode.id()
          }})
          console.log( 'connection from:  ' + SelectedNode.id() + " to"+ CurrentNode.id() );
          SelectedNode = null;

    
  }
})

cy.on("cxttap" , "edge"  , function(evt){
  cy.remove(evt.target)
})
  
  
document.addEventListener('click',function(event){
  console.log("click")
  SelectedNode = null;
})

  function CreateNode(){ // add custom name, custom metadata
    cy.add({
    data:{id:'another'+ (++uniqueIdNumber)}, // unique id
    position:averageGridCenter()
   }) //position =  average pos of all obj
}



averageGridCenter = () => {
  for (let i =0 ; i < cy.nodes().length;i++){
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


