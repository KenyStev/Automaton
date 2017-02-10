var dfa_automatons = AutomatonJS.examples.getDFA()
var nfa_automatons = AutomatonJS.examples.getNFA()
var nfae_automatons = AutomatonJS.examples.getNFAe()

updateList("DFA")
updateList("NFA")
updateList("NFAe")

function saveAutomaton (mode) {
	let alphabet = document.getElementById('automaton-alphabet').value
	alphabet = alphabet.split(',')
	let automaton = undefined

	try {
		if (mode == "DFA"){
	      automaton = AutomatonJS.NewDFA(network.body.data,"nuevo",alphabet)
	      dfa_automatons.push(automaton)
	    }else if (mode == "NFA"){
	      automaton = AutomatonJS.NewNFA(network.body.data,"nuevo",alphabet)
	      nfa_automatons.push(automaton)
	    }else if (mode == "NFAe"){
	      automaton = AutomatonJS.NewNFAe(network.body.data,"nuevo",alphabet)
	      nfae_automatons.push(automaton)
	    }

	    updateList(mode)

	    currentAutomaton = automaton
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

function updateList(mode){
	if (mode=="DFA") {
		document.getElementById('dfa-automatons').innerHTML = `
			${generateItems(dfa_automatons,mode)}
		`
	}else if (mode=="NFA") {
		document.getElementById('nfa-automatons').innerHTML = `
			${generateItems(nfa_automatons,mode)}
		`
	}else if (mode=="NFAe") {
		document.getElementById('nfae-automatons').innerHTML = `
			${generateItems(nfae_automatons,mode)}
		`
	}
}

function generateItems(data,mode){
	let html = ""
	let index = 0
	for(let d of data){
		html += "<a href='#' class='list-group-item' onclick='loadAutomaton("+index+","+'"'+mode+'"'+")'>"+ "<h4 class='list-group-item-heading'>automaton "+ index +"</h4></a>"
		index += 1
	}
	return html
}

function loadAutomaton(id,mode){
	let example = undefined
	if (mode=="DFA")
		example = dfa_automatons[id]
	else if (mode=="NFA")
		example = nfa_automatons[id]
	else if (mode=="NFAe")
		example = nfae_automatons[id]
	dataSet = example.toDataSet()
	draw()
	document.getElementById('automaton-alphabet').value = Array.from(example.alphabet).join(",")
	currentAutomaton = example
}

$('#save-dfa').on('click',e => {
	saveAutomaton("DFA")
})

$('#save-nfa').on('click',e => {
	saveAutomaton("NFA")
})

$('#save-nfae').on('click',e => {
	saveAutomaton("NFAe")
})