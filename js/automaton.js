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