import DFA from "./DFA"

export default function NewDFA(data, name, alphabet) {
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

function objectToArray(obj) {
	return Object.keys(obj).map(function (key) { return obj[key]; });
}

function getState(data, id) {
	return data.nodes._data[id]
}