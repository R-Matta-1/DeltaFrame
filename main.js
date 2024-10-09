const FakeConsole = document.getElementById("trash")


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


function CreateNode(){
  cy.add({
    data:{id:'another'},
    position:averageGridCenter()
   }) //position =  average pos of all obj
}

averageGridCenter = () => {
  FakeConsole.innerHTML =JSON.stringify(cy.nodes("[]"))

  return {x:0,y:0}
}