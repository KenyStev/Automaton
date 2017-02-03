import DFA from "./DFA"
import NFA from "./NFA"

export function NewDFA(data, name, alphabet) {
	const DFAutomaton = new DFA("name", alphabet)
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
	const NFAutomaton = new NFA("name", alphabet)
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

function objectToArray(obj) {
	return Object.keys(obj).map(function (key) { return obj[key]; });
}

function getState(data, id) {
	return data.nodes._data[id]
}