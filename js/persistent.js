var dfa_automatons = localStorage.getItem('dfa')
var nfa_automatons = localStorage.getItem('nfa')
var nfae_automatons = localStorage.getItem('nfae')
var regex_automatons = localStorage.getItem('regex')
var pda_automatons = localStorage.getItem('pda')

dfa_automatons = dfa_automatons?(JSON.parse(dfa_automatons)).array:AutomatonJS.examples.getDFA()
nfa_automatons = nfa_automatons?(JSON.parse(nfa_automatons)).array:AutomatonJS.examples.getNFA()
nfae_automatons = nfae_automatons?(JSON.parse(nfae_automatons)).array:AutomatonJS.examples.getNFAe()
regex_automatons = regex_automatons?(JSON.parse(regex_automatons)).array:AutomatonJS.examples.getRegex()
pda_automatons = pda_automatons?(JSON.parse(pda_automatons)).array:AutomatonJS.examples.getPDA()

updateList("DFA")
updateList("NFA")
updateList("NFAe")
updateList("regex")
updateList("PDA")

function getInputAlphabet(){return document.getElementById('automaton-alphabet').value.split(',')}
function getInputName(){return document.getElementById('automaton-name').value}
function getInputWord(){return document.getElementById('automaton-word').value}
function getInputRegex(){return document.getElementById('regex-automaton').value}



function saveAutomaton (mode) {
	let alphabet = getInputAlphabet()
	let name = getInputName()
	let automaton = undefined

	try {
		if (mode == "DFA"){
	      automaton = AutomatonJS.NewDFA(network.body.data,name,alphabet)
	      dfa_automatons.push({
	      	name: automaton.name,
	      	alphabet: Array.from(automaton.alphabet),
	      	dataset: automaton.toDataSet()
	      })
	      localStorage.setItem('dfa',JSON.stringify({array: dfa_automatons}))
	    }else if (mode == "NFA"){
	      automaton = AutomatonJS.NewNFA(network.body.data,name,alphabet)
	      nfa_automatons.push({
	      	name: automaton.name,
	      	alphabet: Array.from(automaton.alphabet),
	      	dataset: automaton.toDataSet()
	      })
	      localStorage.setItem('nfa',JSON.stringify({array: nfa_automatons}))
	    }else if (mode == "NFAe"){
	      automaton = AutomatonJS.NewNFAe(network.body.data,name,alphabet)
	      nfae_automatons.push({
	      	name: automaton.name,
	      	alphabet: Array.from(automaton.alphabet),
	      	dataset: automaton.toDataSet()
	      })
	      localStorage.setItem('nfae',JSON.stringify({array: nfae_automatons}))
	    }else if (mode == "PDA"){
	      automaton = AutomatonJS.NewPDA(network.body.data,name,alphabet)
	      pda_automatons.push({
	      	name: automaton.name,
	      	alphabet: Array.from(automaton.alphabet),
	      	dataset: automaton.toDataSet()
	      })
	      localStorage.setItem('pda',JSON.stringify({array: pda_automatons}))
	    }else if (mode == "regex") {
	    	regex_automatons.push({regex: getInputRegex(), name: getInputName()})
	    	localStorage.setItem('regex',JSON.stringify({array: regex_automatons}))
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
	}else if (mode=="PDA") {
		document.getElementById('pda-automatons').innerHTML = `
			${generateItems(pda_automatons,mode)}
		`
	}else if (mode=="regex") {
		document.getElementById('basic-regexes').innerHTML = `
			${generateItems(regex_automatons,mode)}
		`
	}
}

function generateItems(data,mode){
	let html = ""
	let index = 0
	for(let d of data){
		html += `<a href='#' class='list-group-item' onclick='loadAutomaton(${index},"${mode}")'>
					<p class='list-group-item-heading'>${(mode=="regex")?'regex':'automaton'}  ${index} - ${d.name}</p>
				</a>`;
		index += 1
	}
	return html
}

function loadAutomaton(id,mode){
	let example = undefined
	if (mode=="DFA"){
		let dataObj = dfa_automatons[id]
		example = AutomatonJS.NewDFA(dataObj.dataset,dataObj.name,dataObj.alphabet)
	}
	else if (mode=="NFA"){
		example = nfa_automatons[id]
		example = AutomatonJS.NewNFA(example.dataset,example.name,example.alphabet)
	}
	else if (mode=="NFAe"){
		example = nfae_automatons[id]
		example = AutomatonJS.NewNFAe(example.dataset,example.name,example.alphabet)
	}
	else if (mode=="PDA"){
		example = pda_automatons[id]
		example = AutomatonJS.NewPDA(example.dataset,example.name,example.alphabet)
	}
	else if (mode=="regex"){
		showRegexInfo(regex_automatons[id])
	}
	if (mode!="regex") {
		setAutomaton(example)
	}
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

$('#save-pda').on('click',e => {
	saveAutomaton("PDA")
})

$('#save-regex').on('click',e => {
	saveAutomaton("regex")
})

$('#clear-canvas').on('click', e => {
  network.setData({})
  showAutomatonInfo("","")
  document.getElementById('automaton-word').value = ""
  document.getElementById('regex-automaton').value = ""
})