import Automaton, {State, Transition} from "./automaton"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError 
} from "./errors"

export default class DFA extends Automaton{
	constructor(name, alphabet){super(name, alphabet)}

	addState(stateName, isInitial = false, isFinal = false){
		if(!this.findState(stateName)){
			this.states.push(new State(stateName,isInitial,isFinal))
		}else{
			throw new StateAlreadyExistError(state.label)
		}
	}

	addTransition(transitionName, fromName, toName) {
		const from = this.states.filter(e => e.label == fromName)[0]
		const to = this.states.filter(e => e.label == toName)[0]

		if (!from)
			throw new UnknownStateError(fromName)
		if (!to)
			throw new UnknownStateError(toName)
		transitionName.split(/,|\//).forEach(c => {
			if (!this.alphabet.has(c))
				throw new UnknownCharError(c)
		})
		if (!this.isDeterministic(from,transitionName))
			throw new DeterminismError(fromName,transitionName)

		from.addTransition(new Transition(transitionName,fromName,toName))
	}

	isDeterministic(from, a) {
		return !from.transitions.filter(e => e.label == a).length
	}

	match(w) {
		let currentState = this.states.filter(e => e.isInitial)[0]

		for(let a of w) {
			let nextTransition = currentState.transitions.filter(e => e.match(a))[0]

			if (!nextTransition)
				throw new NextTransitionError(a)

			currentState = this.findState(nextTransition.to)
		}

		return currentState
	}
}