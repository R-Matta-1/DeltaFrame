console.log("hello Setup\n world")


var nodes = new vis.DataSet([
    {id: 0, label:"Start"},
    {id:2 , label:"f(x)"},
    {id: 1, label:"Final Product"}
]);

var edges = new vis.DataSet([
    {from:0 ,to:2},
    {from:2, to:1}
]);

var container = document.getElementById('graphNetwork');

var data = {
    nodes:nodes,
    edges:edges
};
var network = new vis.Network(container, data, {});
