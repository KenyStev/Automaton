
function getStateColor(state) {
	let colorGreen = '00'
	let colorRed = '00'
	if (state.nodeId.toString().indexOf('start')!==-1)
		colorGreen = 'ff'
	if (state.nodeId.toString().indexOf('end')!==-1)
		colorRed = 'ff'
	let color = "#" + colorRed + colorGreen + "00"
	return color
}

var currentAutomaton = undefined
var network = null;
// randomly create some nodes and edges
var dataSet = {
    nodes: [],
    edges: []
  };//getScaleFreeNetwork(25);
var seed = 2;

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();

  // create a network
  var container = document.getElementById('mynetwork');
  var options = {
    layout: {randomSeed:seed,improvedLayout:false}, // just to make sure the layout is the same when the locale is changed
    edges:{
      arrows: {
        to:     {enabled: true, scaleFactor:1, type:'arrow'}
      }
    },
    locale: 'en', //document.getElementById('locale').value,
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Add Node";
        editNode(data, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Edit Node";
        editNode(data, callback);
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r != true) {
            callback(null);
            return;
          }
        }
        document.getElementById('edge-operation').innerHTML = "Add Edge";
        // document.getElementById('edge-arrows-row').style.display = 'none';
        // document.getElementById('edge-arrows').value = 'to';
        editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function(data, callback) {
          document.getElementById('edge-operation').innerHTML = "Edit Edge";
          // document.getElementById('edge-arrows-row').style.display = '';
          // document.getElementById('edge-arrows').value = 'to';
          // console.log(data);
          editEdgeWithoutDrag(data,callback);
        }
      }
    }
  };
  network = new vis.Network(container, dataSet, options);
  // console.log(JSON.stringify(objectToArray(network.body.data.nodes._data)));
}

function editNode(data, callback) {
  document.getElementById('node-id').value = data.nodeId;
  document.getElementById('node-label').value = data.label;
  document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
  document.getElementById('node-cancelButton').onclick = cancelNodeEdit.bind(this,callback);
  document.getElementById('node-popUp').style.display = 'block';
}

function clearNodePopUp() {
  document.getElementById('node-saveButton').onclick = null;
  document.getElementById('node-cancelButton').onclick = null;
  document.getElementById('node-popUp').style.display = 'none';
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(data, callback) {
  data.nodeId = document.getElementById('node-id').value;
  data.label = document.getElementById('node-label').value;
  let color = getStateColor(data)
  if (color == '#000000') {
    data.color = null;
  }else{
    data.color = color;
  };
  clearNodePopUp();
  callback(data);
}

function editEdgeWithoutDrag(data, callback) {
  // filling in the popup DOM elements
  document.getElementById('edge-label').value = data.label;
  document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
  document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
  document.getElementById('edge-popUp').style.display = 'block';
}

function clearEdgePopUp() {
  document.getElementById('edge-saveButton').onclick = null;
  document.getElementById('edge-cancelButton').onclick = null;
  document.getElementById('edge-popUp').style.display = 'none';
}

function cancelEdgeEdit(callback) {
  clearEdgePopUp();
  callback(null);
}

function saveEdgeData(data, callback) {
  if (typeof data.to === 'object')
    data.to = data.to.id
  if (typeof data.from === 'object')
    data.from = data.from.id
  data.label = document.getElementById('edge-label').value;
  data.arrows = 'to'
  clearEdgePopUp();
  callback(data);
}

function objectToArray(obj) {
  return Object.keys(obj).map(function (key) { return obj[key]; });
}

function showMessageError(err){
  if (err.message != "finalState is undefined")
          return err.message + "."
  return ""
}

function init() {
  draw()
}

$('#clear-canvas').on('click', e => {
  network.setData({})
})