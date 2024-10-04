console.log("hello Setup\n world")


var nodes = new vis.DataSet([
    {id: 0, label:"Start" ,
         fixed:{x : true , y:true},
         x:0,y:0
          ,shape:"diamond"},

    {id:2 , label:"f(Start) -> end"},

    {id: 1, label:"Final Product" ,
          fixed:{x : true , y:true},
        x:1000,y:0
          ,shape:"diamond"}
]);

var edges = new vis.DataSet([
    {from:0 ,to:2},
    {from:2, to:1}
]);

var options = {
manipulation:{enable: true, deleteEdge:true}
}

var container = document.getElementById('graphNetwork');

var data = {
    nodes:nodes,
    edges:edges
};
var network = new vis.Network(container, data, options);

function CreateNode() {
    console.log(document.getElementById("FunctionAction"))

}