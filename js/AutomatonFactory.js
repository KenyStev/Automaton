import DFA from "./DFA"
import NFA from "./NFA"
import NFAe from "./NFA-e"
import PDA from "./PDA"
import Parser from "./regular-expression-parser/regular-expression"

var seed = 0
var steps = 0
const epsilon = "epsilon"

function newQ(){
	let tmp = seed
	seed++
	return tmp
}

function nextStep(){
	let tmp = steps
	steps++
	return tmp
}

export function NewDFA(data, name, alphabet) {
	const DFAutomaton = new DFA(name, alphabet)
	let states = objectToArray(('_data' in data.nodes)?data.nodes._data:data.nodes)
	states.forEach(state => {
		DFAutomaton.addState(state.label,
			state.nodeId.toString().indexOf("start")!==-1,
			state.nodeId.toString().indexOf("end")!==-1)
	})

	let transitions = objectToArray(('_data' in data.edges)?data.edges._data:data.edges)
	transitions.forEach(transition => {
		DFAutomaton.addTransition(transition.label,
			getState(data,transition.from).label, getState(data,transition.to).label)
	})

	return DFAutomaton
}

export function NewNFA(data, name, alphabet) {
	const NFAutomaton = new NFA(name, alphabet)
	let states = objectToArray(('_data' in data.nodes)?data.nodes._data:data.nodes)
	states.forEach(state => {
		NFAutomaton.addState(state.label,
			state.nodeId.toString().indexOf("start")!==-1,
			state.nodeId.toString().indexOf("end")!==-1)
	})

	let transitions = objectToArray(('_data' in data.edges)?data.edges._data:data.edges)
	transitions.forEach(transition => {
		NFAutomaton.addTransition(transition.label,
			getState(data,transition.from).label, getState(data,transition.to).label)
	})

	return NFAutomaton
}

export function NewNFAe(data, name, alphabet) {
	const NFAeutomaton = new NFAe(name, alphabet)
	let states = objectToArray(('_data' in data.nodes)?data.nodes._data:data.nodes)
	states.forEach(state => {
		NFAeutomaton.addState(state.label,
			state.nodeId.toString().indexOf("start")!==-1,
			state.nodeId.toString().indexOf("end")!==-1)
	})

	let transitions = objectToArray(('_data' in data.edges)?data.edges._data:data.edges)
	transitions.forEach(transition => {
		NFAeutomaton.addTransition(transition.label,
			getState(data,transition.from).label, getState(data,transition.to).label)
	})

	return NFAeutomaton
}

export function NewPDA(data, name, alphabet) {
	const PDAeutomaton = new PDA(name, alphabet)
	let states = objectToArray(('_data' in data.nodes)?data.nodes._data:data.nodes)
	states.forEach(state => {
		PDAeutomaton.addState(state.label,
			state.nodeId.toString().indexOf("start")!==-1,
			state.nodeId.toString().indexOf("end")!==-1)
	})

	let transitions = objectToArray(('_data' in data.edges)?data.edges._data:data.edges)
	transitions.forEach(transition => {
		PDAeutomaton.addTransition(transition.label,
			getState(data,transition.from).label, getState(data,transition.to).label)
	})

	return PDAeutomaton
}

export function regexToNFAe(regex){
	seed = 0
	let stepByStep = regexToNFAe_STEPS(regex)
	return {nfae: stepByStep[stepByStep.length-1], stepByStep: stepByStep}
}

export function regexToNFAe_STEPS(regex){
	seed = 0
	let grammarTree = Parser.parse(regex)
	let stepByStep = getStepByStepRegexToNFAE(grammarTree)
	return stepByStep
}

export function unionAutomaton(dfa0,dfa1){
	let fusedAutomaton = fuseAutomatons("union: "+dfa0.name+' U '+dfa1.name,dfa0,dfa1)
	return setFinalStatesForUnion(fusedAutomaton,dfa0,dfa1)
}

export function intersectionAutomaton(dfa0,dfa1){
	let fusedAutomaton = fuseAutomatons("intersection: "+dfa0.name+' N '+dfa1.name,dfa0,dfa1)
	return setFinalStatesForIntersection(fusedAutomaton,dfa0,dfa1)
}

export function differenceAutomaton(dfa0,dfa1){
	let fusedAutomaton = fuseAutomatons("difference: "+dfa0.name+' - '+dfa1.name,dfa0,dfa1)
	return setFinalStatesForDifference(fusedAutomaton,dfa0,dfa1)
}

export function complementAutomaton(dfa){
	let complemented = changeFinalStates("complement: "+dfa.name,dfa)
	return lookForSink(complemented)
}

//operaciones con automatas
function getStateLabel(state0,state1){
	return [state0.label+'/a',state1.label+'/b'].sort().join(',')
}

function getStateForSymbol(state,dfa0,dfa1,a){
	let statesCmb = state.label.split(',')
	let states = []
	for(let s of statesCmb){
		let fromState = undefined
		let toState = undefined
		let fromIdentifier = s.split('/')
		if (fromIdentifier[1]=='a') {
			fromState = dfa0.states.find(x => x.label == fromIdentifier[0])
		}else{
			fromState = dfa1.states.find(x => x.label == fromIdentifier[0])
		}
		if (fromState) {toState = fromState.transitions.find(x => x.match(a))}
		if (toState) {states.push(toState.to+'/'+fromIdentifier[1])}
	}
	if (states.length>0)
		return states.sort().join(',')
	return null
}

function fuseAutomatons(name,dfa0,dfa1){
	let newAlphabet = new Set(Array.from(dfa0.alphabet).concat(Array.from(dfa0.alphabet),Array.from(dfa1.alphabet)))
	let fusedAutomaton = new DFA(name,Array.from(newAlphabet))

	let initialState0 = dfa0.getInitialState()
	let initialState1 = dfa1.getInitialState()

	fusedAutomaton.addState(getStateLabel(initialState0,initialState1),true)

	for(let state of fusedAutomaton.states){
		for(let a of Array.from(newAlphabet)){
			let newState = getStateForSymbol(state,dfa0,dfa1,a)
			if (newState && !fusedAutomaton.states.find(x => x.label==newState)) {
				fusedAutomaton.addState(newState)
			}
			if (newState){
				fusedAutomaton.addTransition(a,state.label,newState)
			}
		}
	}

	return fusedAutomaton
}

function setFinalStatesForUnion(fusedAutomaton,dfa0,dfa1){
	let finalStates0 = dfa0.states.filter(x => x.isFinal).map(x => x.label+'/a')
	let finalStates1 = dfa1.states.filter(x => x.isFinal).map(x => x.label+'/b')
	let finalStates = finalStates0.concat(finalStates0,finalStates1)

	for(let finalState of finalStates){
		fusedAutomaton.states.filter(x => x.label.indexOf(finalState)!=-1).forEach(state => {
			state.setFinal()
		})
	}
	return fusedAutomaton
}

function setFinalStatesForIntersection(fusedAutomaton,dfa0,dfa1){
	let finalStates0 = dfa0.states.filter(x => x.isFinal).map(x => x.label+'/a')
	let finalStates1 = dfa1.states.filter(x => x.isFinal).map(x => x.label+'/b')

	fusedAutomaton.states.filter(x => {
		let state = finalStates0.filter(fs0 => x.label.indexOf(fs0)!=-1).length>0
		if (!state) return false
		return finalStates1.filter(fs1 => x.label.indexOf(fs1)!=-1).length>0
	}).forEach(state => {
		state.setFinal()
	})
	return fusedAutomaton
}

function setFinalStatesForDifference(fusedAutomaton,dfa0,dfa1){
	let finalStates0 = dfa0.states.filter(x => x.isFinal).map(x => x.label+'/a')
	let finalStates1 = dfa1.states.filter(x => x.isFinal).map(x => x.label+'/b')

	fusedAutomaton.states.filter(x => {
		let state = finalStates0.filter(fs0 => x.label.indexOf(fs0)!=-1).length>0
		if (!state) return false
		return finalStates1.filter(fs1 => x.label.indexOf(fs1)!=-1).length==0
	}).forEach(state => {
		state.setFinal()
	})
	return fusedAutomaton
}

function changeFinalStates(name,dfa){
	let complement = new DFA(name,Array.from(dfa.alphabet))
	
	dfa.states.forEach(state => complement.addState(state.label,state.isInitial,!state.isFinal))
	dfa.states.forEach(state => state.transitions.forEach(t => complement.addTransition(t.label,t.from,t.to)))
	return complement
}

function lookForSink(dfa){
	let sink = 'sink'
	let addedSink = false
	for(let state of dfa.states){
		for(let a of dfa.alphabet){
			if(!state.hasTransition(a)){
				if (!addedSink) {
					dfa.addState(sink,false,true)
					dfa.addTransition(Array.from(dfa.alphabet).join('/'),sink,sink)
					addedSink = true
				}
				dfa.addTransition(a,state.label,sink)
			}
		}
	}
	return dfa
}

//convert to regex
function getStepByStepRegexToNFAE(node){
	let stepByStep = []

	if (node.name == "character") {
		stepByStep.push(getNFAEcharacter(node.value))
	}else if (node.name == "kleene") {
		let stepsToKleene = getStepByStepRegexToNFAE(node.expression)
		stepsToKleene.push(getNFAEkleene(stepsToKleene[stepsToKleene.length-1]))
		stepByStep = stepsToKleene
	}else{
		let leftSteps = []
		let rightSteps = []
		let currentNFAE = null
		if (node.left) {
			leftSteps = getStepByStepRegexToNFAE(node.left)
		}
		if (node.right) {
			rightSteps = getStepByStepRegexToNFAE(node.right)
		}

		if (leftSteps.length>0 && rightSteps.length>0) {
			let leftStep = leftSteps[leftSteps.length-1]
			let rightStep = rightSteps[rightSteps.length-1]

			if (node.name == "pipe") {
				currentNFAE = getNFAEpipe(leftStep,rightStep)
			}else if (node.name == "concat") {
				currentNFAE = getNFAEconcat(leftStep,rightStep)
			}
			stepByStep = stepByStep.concat(leftSteps,rightSteps)
			if (currentNFAE != null) {
				stepByStep.push(currentNFAE)
			}
		}
	}
	return stepByStep
}

function getNFAEcharacter(character){
	let nfae = new NFAe('step: '+nextStep()+'/ char', [character])
	let newInitialStateLabel = 'q'+newQ()
	let newFinalStateLabel = 'q'+newQ()

	nfae.addState(newInitialStateLabel,true)
	nfae.addState(newFinalStateLabel,false,true)
	nfae.addTransition(character,newInitialStateLabel,newFinalStateLabel)

	return nfae
}

function getNFAEpipe(nfae0,nfae1){
	let alphabet = Array.from(new Set(Array.from(nfae0.alphabet)
		.concat(Array.from(nfae0.alphabet),Array.from(nfae1.alphabet))))
	let nfae = new NFAe('step: '+nextStep()+'/ pipe', alphabet)
	
	let newInitialStateLabel = 'q'+newQ()
	let newFinalStateLabel = 'q'+newQ()

	nfae.addState(newInitialStateLabel,true)
	nfae.addState(newFinalStateLabel,false,true)

	let initialState0 = nfae0.states.find(x => x.isInitial)
	let finalState0 = nfae0.states.find(x => x.isFinal)
	let initialState1 = nfae1.states.find(x => x.isInitial)
	let finalState1 = nfae1.states.find(x => x.isFinal)

	nfae0.states.forEach(state => nfae.addState(state.label))
	nfae0.states.forEach(state => {
		state.transitions.forEach(trans => nfae.addTransition(trans.label,trans.from, trans.to))
	})
	nfae1.states.forEach(state => nfae.addState(state.label))
	nfae1.states.forEach(state => {
		state.transitions.forEach(trans => nfae.addTransition(trans.label,trans.from, trans.to))
	})

	nfae.addTransition(epsilon,newInitialStateLabel,initialState0.label)
	nfae.addTransition(epsilon,newInitialStateLabel,initialState1.label)
	nfae.addTransition(epsilon,finalState0.label,newFinalStateLabel)
	nfae.addTransition(epsilon,finalState1.label,newFinalStateLabel)

	return nfae
}

function getNFAEkleene(nfaeIn){
	let alphabet = Array.from(nfaeIn.alphabet)
	let nfae = new NFAe('step: '+nextStep()+'/ kleene', alphabet)

	let newInitialStateLabel = 'q'+newQ()
	let newFinalStateLabel = 'q'+newQ()

	nfae.addState(newInitialStateLabel,true)
	nfae.addState(newFinalStateLabel,false,true)

	let initialStateIn = nfaeIn.states.find(x => x.isInitial)
	let finalStateIn = nfaeIn.states.find(x => x.isFinal)

	nfaeIn.states.forEach(state => nfae.addState(state.label))
	nfaeIn.states.forEach(state => {
		state.transitions.forEach(trans => nfae.addTransition(trans.label,trans.from, trans.to))
	})

	nfae.addTransition(epsilon,finalStateIn.label,initialStateIn.label)
	nfae.addTransition(epsilon,finalStateIn.label,newFinalStateLabel)
	nfae.addTransition(epsilon,newInitialStateLabel,initialStateIn.label)
	nfae.addTransition(epsilon,newInitialStateLabel,newFinalStateLabel)

	return nfae
}

function getNFAEconcat(nfae0,nfae1){
	let alphabet = Array.from(new Set(Array.from(nfae0.alphabet)
		.concat(Array.from(nfae0.alphabet),Array.from(nfae1.alphabet))))
	let nfae = new NFAe('step: '+nextStep()+'/ concat', alphabet)

	let initialState0 = nfae0.states.find(x => x.isInitial)
	let finalState0 = nfae0.states.find(x => x.isFinal)
	let initialState1 = nfae1.states.find(x => x.isInitial)
	let finalState1 = nfae1.states.find(x => x.isFinal)

	nfae0.states.forEach(state => nfae.addState(state.label,state.label==initialState0.label))
	nfae0.states.forEach(state => {
		state.transitions.forEach(trans => nfae.addTransition(trans.label,trans.from, trans.to))
	})
	nfae1.states.forEach(state => nfae.addState(state.label,false,state.label == finalState1.label))
	nfae1.states.forEach(state => {
		state.transitions.forEach(trans => nfae.addTransition(trans.label,trans.from, trans.to))
	})
	nfae.addTransition(epsilon,finalState0.label,initialState1.label)

	return nfae
}

function objectToArray(obj) {
	return Object.keys(obj).map(function (key) { return obj[key]; });
}

function getState(data, id) {
	if ('_data' in data.nodes)
		return data.nodes._data[id]
	return data.nodes.find(x => x.id == id)
}