import DFA from "./DFA"
import NFA from "./NFA"
import NFAe from "./NFA-e"
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
	let states = objectToArray(data.nodes._data)
	states.forEach(state => {
		DFAutomaton.addState(state.label,
			state.nodeId.toString().indexOf("start")!==-1,
			state.nodeId.toString().indexOf("end")!==-1)
	})

	let transitions = objectToArray(data.edges._data)
	transitions.forEach(transition => {
		DFAutomaton.addTransition(transition.label,
			getState(data,transition.from).label, getState(data,transition.to).label)
	})

	return DFAutomaton
}

export function NewNFA(data, name, alphabet) {
	const NFAutomaton = new NFA(name, alphabet)
	let states = objectToArray(data.nodes._data)
	states.forEach(state => {
		NFAutomaton.addState(state.label,
			state.nodeId.toString().indexOf("start")!==-1,
			state.nodeId.toString().indexOf("end")!==-1)
	})

	let transitions = objectToArray(data.edges._data)
	transitions.forEach(transition => {
		NFAutomaton.addTransition(transition.label,
			getState(data,transition.from).label, getState(data,transition.to).label)
	})

	return NFAutomaton
}

export function NewNFAe(data, name, alphabet) {
	const NFAeutomaton = new NFAe(name, alphabet)
	let states = objectToArray(data.nodes._data)
	states.forEach(state => {
		NFAeutomaton.addState(state.label,
			state.nodeId.toString().indexOf("start")!==-1,
			state.nodeId.toString().indexOf("end")!==-1)
	})

	let transitions = objectToArray(data.edges._data)
	transitions.forEach(transition => {
		NFAeutomaton.addTransition(transition.label,
			getState(data,transition.from).label, getState(data,transition.to).label)
	})

	return NFAeutomaton
}

export function regexToNFAe(regex){
	seed = 0
	let grammarTree = Parser.parse(regex)
	let stepByStep = getStepByStepRegexToNFAE(grammarTree)
	return stepByStep[stepByStep.length-1]
}

export function regexToNFAe_STEPS(regex){
	seed = 0
	let grammarTree = Parser.parse(regex)
	let stepByStep = getStepByStepRegexToNFAE(grammarTree)
	return stepByStep.sort((a,b) => {
		if (a.name < b.name) return -1
		if (a.name > b.name) return 1
		return 0
	})
}

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
	let nfae = new NFAe('step: '+nextStep()+' char', [character])
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
	let nfae = new NFAe('step: '+nextStep()+' pipe', alphabet)
	
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
	let nfae = new NFAe('step: '+nextStep()+' kleene', alphabet)

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
	let nfae = new NFAe('step: '+nextStep()+' concat', alphabet)

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
	return data.nodes._data[id]
}