String.prototype.replaceAll = function(search, replacement) {
    var target = this
    return target.split(search).join(replacement)
}

export default class Automaton {
	alphabet = undefined
	states = []
	constructor(name, alphabet){
		this.name = name
		this.setAlphabet(alphabet)
	}

	setAlphabet(alphabet) {
		this.alphabet = new Set()
		alphabet.forEach(c => {
			this.alphabet.add(c)
		})
	}

	addState(state) {
		this.states.push(state)
	}

	addTransition(transition) {
		const from = this.states.filter(e => e.label == transition.from)[0]
		from.addTransition(transition)
	}

	findState(stateName) {
		return this.states.filter(e => e.label == stateName)[0];
	}

	getInitialState(){
		let currentState = this.states.filter(e => e.isInitial)[0]
		return currentState
	}

	toDataSet(){
		let nodes = []
		let edges = []
		this.states.map(x => {
			nodes.push({nodeId: `${x.isInitial?'start':''}/${x.isFinal?'end':''}`,
				id: x.label, label: x.label, color: getStateColor(x)})
			x.transitions.map(t => {
				edges.push({from: t.from, to: t.to, label: t.label, font: {align: 'middle'}})
			})
		})
		return {nodes: nodes, edges: edges}
	}

	toData(){
		let nodes = []
		let edges = []
		this.states.map(x => {
			nodes.push({isInitial: x.isInitial, isFinal: x.isFinal, label: x.label})
			x.transitions.map(t => {
				edges.push({from: t.from, to: t.to, label: t.label})
			})
		})
		return {nodes: nodes, edges: edges}
	}
}

export class State {
	transitions = []
	constructor(label = "new State", isInitial = false, isFinal = false){
		this.label = label
		this.isInitial = isInitial
		this.isFinal = isFinal
	}

	addTransition(transition){
		this.transitions.push(transition)
	}
}

export class Transition {
	constructor(label = "new Transition", from = "from", to = "to"){
		this.label = label
		this.from = from
		this.to = to
	}

	match(a) {
		for(let e of this.label.split(/,|\//))
		{
			if (e == a) 
				return true
		}
		return false
	}
}

function getStateColor(state) {
	let colorGreen = '00'
	let colorRed = '00'
	if (state.isInitial)
		colorGreen = 'ff'
	if (state.isFinal)
		colorRed = 'ff'
	let color = "#" + colorRed + colorGreen + "00"
	return (color=="#000000")?undefined:color
}