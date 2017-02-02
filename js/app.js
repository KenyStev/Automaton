import DFA from "./DFA"
import NewDFA from "./AutomatonFactory"
// import vis from "../node_modules/vis"

exports.NewDFA = NewDFA;

// var container = document.getElementById('myNetwork')

// var nodes = [
//   {id: 1, label: 'q0', nodeId: 'start'},
//   {id: 2, label: '0', nodeId: 2},
//   {id: 3, label: '00', nodeId: 3},
//   {id: 4, label: '000', nodeId: 'end'}
// ];
// var edges = [
//   {from: 1, to: 1, label: '1', font: {align: 'middle'}},
//   {from: 1, to: 2, label: '0', font: {align: 'middle'}},
//   {from: 2, to: 1, label: '1', font: {align: 'middle'}},
//   {from: 2, to: 3, label: '0', font: {align: 'middle'}},
//   {from: 3, to: 1, label: '1', font: {align: 'middle'}},
//   {from: 3, to: 4, label: '0', font: {align: 'middle'}},
//   {from: 4, to: 4, label: '0/1', font: {align: 'middle'}}
// ];

// var dataSet = {
// 	nodes: nodes,
// 	edges: edges
// }

// var options = {}

// network = new vis.Network(container, dataSet, options);