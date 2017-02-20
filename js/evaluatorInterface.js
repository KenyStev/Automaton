
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

$('#send-automaton-dfa').on('click', e => {
  evaluateDfa(e)
})
$('#send-automaton-nfa').on('click', e => {
  evaluateNfa(e)
})
$('#send-automaton-nfae').on('click', e => {
  evaluateNfae(e)
})