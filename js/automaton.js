export default class Automaton {
	alphabet = []
	states = []
	constructor(name, alphabet){
		this.name = name
		this.alphabet = alphabet
	}

	setAlphabet(alphabet) {
		this.alphabet = alphabet
	}

	addState(state) {
		this.states.push(state)
	}

	addTransition(transition) {
		const from = this.states.filter(e => e.label == transition.from)[0]
		from.addTransition(transition)
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
}