import Automaton, {State, Transition} from "./automaton"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError 
} from "./errors"

export default class NFA extends Automaton{
	constructor(name, alphabet){super(name, alphabet)}

	addState(stateName, isInitial = false, isFinal = false){
		if(!this.findState(stateName)){
			this.states.push(new State(stateName,isInitial,isFinal))
		}else{
			throw new StateAlreadyExistError(stateName)
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

		from.addTransition(new Transition(transitionName,fromName,toName))
	}

	match(w,currentState){
		// console.log(`W: ${w} - len: ${w.length} state: ${currentState.label}`)
		if (w.length>0) {
			let a = w.charAt(0)
			let transitions = currentState.transitions.filter(e => e.match(a))
			if (transitions.length>0) {
				let statesTo = []
				for (let transition of transitions) {
					statesTo.push(this.findState(transition.to))
				}
				if (statesTo) {
					let returnState = null
					for(let state of statesTo){
						if (!returnState){
							returnState = this.match(w.substring(1,w.length),state)
							if (returnState!=null && !returnState.isFinal)
								returnState = null
						}
					}
					return returnState
				}
			}else{
				throw new NextTransitionError(a)
			}
		}
		return currentState
	}
}