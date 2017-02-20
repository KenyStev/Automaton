var stepByStep = undefined

function convertDFAToRE(event){
  convertToRE(event,"DFA")
}

function convertToRE(event,mode) {
  let alphabet = getInputAlphabet()
  let name = getInputName()

  try {
    if (mode == "DFA"){
      automaton = AutomatonJS.NewDFA(network.body.data,name,alphabet)
    }else if (mode == "NFA"){
      automaton = AutomatonJS.NewNFA(network.body.data,name,alphabet).toDFA()
    }else if (mode == "NFAe"){
      automaton = AutomatonJS.NewNFAe(network.body.data,name,alphabet).toDFA()
    }

    currentAutomaton = automaton
    let regexData = currentAutomaton.toRE()
    let regex = regexData.regex
    stepByStep = regexData.stepByStep

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
  let alphabet = getInputAlphabet()
  let name = getInputName()

  let automaton = undefined
  if (mode=="NFA")
    automaton = AutomatonJS.NewNFA(network.body.data,name,alphabet)
  else if (mode=="NFAe")
    automaton = AutomatonJS.NewNFAe(network.body.data,name,alphabet)

  currentAutomaton = automaton.toDFA()
  dataSet = currentAutomaton.toDataSet()
  network.setData(dataSet)
  showAutomatonInfo(automaton.name,automaton.alphabet)
}

function convertRegexToNFAE(event){
	let regex = getInputRegex()
	try{
		let automatonData = AutomatonJS.regexToNFAe(regex)
		currentAutomaton = automatonData.nfae
		dataSet = currentAutomaton.toDataSet()
		network.setData(dataSet)
		showAutomatonInfo(currentAutomaton.name,currentAutomaton.alphabet)
		stepByStep = [automatonData.stepByStep]

		document.getElementById('show-message').innerHTML = `
	      <div class="alert ${regex?'alert-success alert-dismissable':'alert-danger'}">
	        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
	        <strong>${currentAutomaton?"Valid":"Invalid"}!</strong>
	        <button id="show-stepByStep" type="button" class="btn btn-warning btn-block">Step By Step</button>
	      </div>
	    `
     document.getElementById("show-stepByStep").addEventListener("click", teLaCreisteWey)
	}catch(err){
		document.getElementById("show-message").innerHTML = `
	      <div class="alert alert-danger">
	        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
	        <strong>Invalid!</strong> 
	        ${showMessageError(err)}
	      </div>`;
	}

}

function teLaCreisteWey(){
  alert("Te la creiste wey! ha-ha")
  document.getElementById("show-stepByStep").style.display = 'none'
  showStepByStep(stepByStep)
}

function showStepByStep(sbs) {
  document.getElementById("content-panel-sbs").innerHTML = `
    <div class="alert">
      <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
      <div class="panel-group panel-group-lists collapse in" id="sbs-accordion" style=""></div>
    </div>
  `;
  let placeToShow =  document.getElementById("sbs-accordion")
  // let sbs = currentAutomaton.toREstepByStep()
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
        layout: {randomSeed:seed,improvedLayout:false},
        edges:{
          arrows: {
            to:     {enabled: true, scaleFactor:1, type:'arrow'}
          }
        },
        autoResize: true,
        height: '100%',
        width: '100%'
      });
      let stepName = document.createTextNode(step.name)
      let pNode = document.createElement('p')
      pNode.appendChild(stepName)
      nodeStep.insertBefore(pNode,nodeStep.firstChild)
      stepIndex++
    }
    index++
  }
  document.getElementById("show-stepByStep").style.display = 'none'
}

$('#convert-nfa-dfa').on('click', e => {
  convertNFAToDFA(e)
})

$('#convert-nfae-dfa').on('click', e => {
  convertNFAeToDFA(e)
})

$('#convert-dfa-re').on('click', e => {
  convertDFAToRE(e)
})

$('#convert-regex-nfae').on('click', e => {
  convertRegexToNFAE(e)
})