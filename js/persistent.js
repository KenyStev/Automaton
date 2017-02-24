var dfa_automatons = undefined// sessionStorage.getItem('dfa')
var nfa_automatons = undefined//sessionStorage.getItem('nfa')
var nfae_automatons = undefined//sessionStorage.getItem('nfae')

dfa_automatons = dfa_automatons?(JSON.parse(dfa_automatons)).array:AutomatonJS.examples.getDFA()
nfa_automatons = nfa_automatons?(JSON.parse(nfa_automatons)).array:AutomatonJS.examples.getNFA()
nfae_automatons = nfae_automatons?(JSON.parse(nfae_automatons)).array:AutomatonJS.examples.getNFAe()
regex_automatons = AutomatonJS.examples.getRegex()

// dfa_automatons.push(AutomatonJS.unionAutomaton(dfa_automatons[0],dfa_automatons[1]))
// dfa_automatons.push(AutomatonJS.intersectionAutomaton(dfa_automatons[0],dfa_automatons[1]))
// dfa_automatons.push(AutomatonJS.differenceAutomaton(dfa_automatons[0],dfa_automatons[1]))
// dfa_automatons.push(AutomatonJS.complementAutomaton(dfa_automatons[0]))
// dfa_automatons.push(AutomatonJS.complementAutomaton(dfa_automatons[1]))
// dfa_automatons.push(AutomatonJS.complementAutomaton(dfa_automatons[2]))

updateList("DFA")
updateList("NFA")
updateList("NFAe")
updateList("regex")

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
	      dfa_automatons.push(automaton)
	      sessionStorage.setItem('dfa',JSON.stringify({array: dfa_automatons}))
	    }else if (mode == "NFA"){
	      automaton = AutomatonJS.NewNFA(network.body.data,name,alphabet)
	      nfa_automatons.push(automaton)
	      sessionStorage.setItem('nfa',JSON.stringify({array: nfa_automatons}))
	    }else if (mode == "NFAe"){
	      automaton = AutomatonJS.NewNFAe(network.body.data,name,alphabet)
	      nfae_automatons.push(automaton)
	      sessionStorage.setItem('nfae',JSON.stringify({array: nfae_automatons}))
	    }else if (mode == "regex") {
	    	regex_automatons.push({regex: getInputRegex(), name: getInputName()})
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
					<h4 class='list-group-item-heading'>${(mode=="regex")?'regex':'automaton'}  ${index} - ${d.name}</h4>
				</a>`;
		index += 1
	}
	return html
}

function loadAutomaton(id,mode){
	let example = undefined
	if (mode=="DFA"){
		example = dfa_automatons[id]
	}
	else if (mode=="NFA")
		example = nfa_automatons[id]
	else if (mode=="NFAe")
		example = nfae_automatons[id]
	else if (mode=="regex")
		showRegexInfo(regex_automatons[id])
	if (mode!="regex") {
		dataSet = example.toDataSet()
		network.setData(dataSet)
		showAutomatonInfo(example.name,example.alphabet)
	}
	currentAutomaton = example
}

function showAutomatonInfo(name,alphabetSet){
	document.getElementById('automaton-alphabet').value = Array.from(alphabetSet).join(",")
	document.getElementById('automaton-name').value = name
}

function showRegexInfo(data){
	document.getElementById('automaton-name').value = data.name
	document.getElementById('regex-automaton').value = data.regex
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

$('#save-regex').on('click',e => {
	saveAutomaton("regex")
})

$('#clear-canvas').on('click', e => {
  network.setData({})
  showAutomatonInfo("","")
  document.getElementById('automaton-word').value = ""
  document.getElementById('regex-automaton').value = ""
})