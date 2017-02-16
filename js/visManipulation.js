
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
    layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
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
  data.arrows = 'to'//document.getElementById('edge-arrows').value;
  clearEdgePopUp();
  callback(data);
}

function objectToArray(obj) {
  return Object.keys(obj).map(function (key) { return obj[key]; });
}

function evaluateDfa(event){
  evaluate(event,"DFA")
}

function evaluateNfa(event){
  evaluate(event,"NFA")
}

function evaluateNfae(event){
  evaluate(event,"NFAe")
}

function evaluate(event,mode){
	let alphabet = document.getElementById('automaton-alphabet').value
	alphabet = alphabet.split(',')
	let word = document.getElementById('automaton-word').value
  let name = document.getElementById('automaton-name').value
	let automaton = undefined
	let finalState = undefined

	try {
		if (mode == "DFA"){
      automaton = AutomatonJS.NewDFA(network.body.data,name,alphabet)
  		finalState = automaton.match(word)
      automaton.toRE()
    }else if (mode == "NFA"){
      automaton = AutomatonJS.NewNFA(network.body.data,name,alphabet)
      finalState = automaton.match(word,automaton.getInitialState())
    }else if (mode == "NFAe"){
      automaton = AutomatonJS.NewNFAe(network.body.data,name,alphabet)
      finalState = automaton.match(word,[automaton.getInitialState()])
    }

    currentAutomaton = automaton

		document.getElementById('show-message').innerHTML = `
      <div class="alert ${finalState.isFinal?'alert-success alert-dismissable':'alert-danger'}">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <strong>${finalState.isFinal?"Valid":"Invalid"}!</strong> Final State: ${finalState.label}.
      </div>
		`
	}
	catch(err) {
	    document.getElementById("show-message").innerHTML = `
      <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <strong>Invalid!</strong> 
        ${showMessageError(err)}
      </div>`;
	}
}

function showMessageError(err){
  if (err.message != "finalState is undefined")
          return err.message + "."
  return ""
}

function convertDFAToRE(event){
  convertToRE(event,"DFA")
}

function convertToRE(event,mode) {
  let alphabet = document.getElementById('automaton-alphabet').value
  alphabet = alphabet.split(',')
  let name = document.getElementById('automaton-name').value

  try {
    if (mode == "DFA"){
      automaton = AutomatonJS.NewDFA(network.body.data,name,alphabet)
    }else if (mode == "NFA"){
      automaton = AutomatonJS.NewNFA(network.body.data,name,alphabet).toDFA()
    }else if (mode == "NFAe"){
      automaton = AutomatonJS.NewNFAe(network.body.data,name,alphabet).toDFA()
    }

    currentAutomaton = automaton
    let regex = currentAutomaton.toRE()

    document.getElementById('show-message').innerHTML = `
      <div class="alert ${regex?'alert-success alert-dismissable':'alert-danger'}">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <strong>${regex?"Valid":"Invalid"}!</strong> regex: ${regex}
        <button id="show-stepByStep" type="button" class="btn btn-warning btn-block">Step By Step</button>
      </div>
    `
     document.getElementById("show-stepByStep").addEventListener("click", teLaCreisteWey)
  }
  catch(err) {
      document.getElementById("show-message").innerHTML = `
      <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <strong>Invalid!</strong> 
        ${showMessageError(err)}
      </div>`;
  }
}

function convertNFAToDFA(event){
  convertToDFA(event,"NFA")
}

function convertNFAeToDFA(event){
  convertToDFA(event,"NFAe")
}

function convertToDFA(event,mode){
  let alphabet = document.getElementById('automaton-alphabet').value
  let name = document.getElementById('automaton-name').value
  alphabet = alphabet.split(',')

  let automaton = undefined
  if (mode=="NFA")
    automaton = AutomatonJS.NewNFA(network.body.data,name,alphabet)
  else if (mode=="NFAe")
    automaton = AutomatonJS.NewNFAe(network.body.data,name,alphabet)

  currentAutomaton = automaton.toDFA()
  dataSet = currentAutomaton.toDataSet()
  network.setData(dataSet)
}

function teLaCreisteWey(){
  alert("Te la creiste wey! ha-ha")
  document.getElementById("show-stepByStep").style.display = 'none'
}

function showStepByStep() {
  document.getElementById("content-panel-sbs").innerHTML = `
    <div class="alert">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
      <div class="panel-group panel-group-lists collapse in" id="sbs-accordion" style=""></div>
    </div>
  `;
  let placeToShow =  document.getElementById("sbs-accordion")
  let sbs = currentAutomaton.toREstepByStep()
  let index = 0

  for(let s of sbs){
    let stepIndex = 0
    let node = document.createElement("div")
    node.className = "panel"
    node.innerHTML = `
      <div class="panel-heading">
        <h4 class="panel-title">
          <a data-toggle="collapse" data-parent="#sbs-accordion" href="#sbs-${index}">
            automaton ${index}
          </a>
        </h4>
      </div>
      <div id="sbs-${index}" class="panel-collapse collapse">
        <div id="sbs-${index}-body" class="panel-body row">
          
        </div>
      </div>
    `;
    placeToShow.appendChild(node)
    let panelBody = document.getElementById("sbs-"+index+"-body")
    for(let step of s){
      let nodeStep = document.createElement("div")
      nodeStep.className = "stepByStep col-md-6 col-xs-12"
      nodeStep.id = "stepByStep-" + stepIndex
      panelBody.appendChild(nodeStep)
      // nodeStep = document.getElementById("stepByStep-" + stepIndex)
      let newNetwork = new vis.Network(nodeStep, step.toDataSet(), {
        autoResize: true,
        height: '100%',
        width: '100%',
        layout:{randomSeed:5}
      });
      stepIndex++
    }
    index++
  }
  document.getElementById("show-stepByStep").style.display = 'none'
}

function init() {
  draw()
}

$('#send-automaton-dfa').on('click', e => {
  evaluateDfa(e)
})
$('#send-automaton-nfa').on('click', e => {
  evaluateNfa(e)
})
$('#send-automaton-nfae').on('click', e => {
  evaluateNfae(e)
})

$('#convert-nfa-dfa').on('click', e => {
  convertNFAToDFA(e)
})

$('#convert-nfae-dfa').on('click', e => {
  convertNFAeToDFA(e)
})

$('#convert-dfa-re').on('click', e => {
  convertDFAToRE(e)
})

$('#clear-canvas').on('click', e => {
  network.setData({})
})