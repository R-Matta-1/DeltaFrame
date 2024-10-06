var cy = cytoscape({

    container: document.getElementById('cy'), // container to render in
  
    elements: [ // list of graph elements to start with
      { // node a
        data: { id: 'Start' }
      },
      { // node b
        data: { id: 'Final' }
      },
      { // edge ab
        data: { id: 'ab', source: 'Start', target: 'Final' }
      }
    ],
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ],
  
    layout: {
      name: 'grid',
      rows: 1
    }
  
  });