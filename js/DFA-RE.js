import Automaton, {State, Transition} from "./automaton"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError 
} from "./errors"

export default class DFAre extends Automaton{
	constructor(name, alphabet){super(name, alphabet)}

	addState(stateName, isInitial = false, isFinal = false){
		if(!this.findState(stateName)){
			this.states.push(new State(stateName,isInitial,isFinal))
		}else{
			throw new StateAlreadyExistError(stateName)
		}
	}

	addTransition(transitionName, fromName, toName) {
		const from = this.states.find(e => e.label == fromName)
		const to = this.states.find(e => e.label == toName)

		if (!from)
			throw new UnknownStateError(fromName)
		if (!to)
			throw new UnknownStateError(toName)
		if (from == to)
			transitionName = '('+transitionName+')*'
		// transitionName.split(/,|\//).forEach(c => {
		// 	if (!this.alphabet.has(c))
		// 		throw new UnknownCharError(c)
		// })
		// if (!this.isDeterministic(from,transitionName))
		// 	throw new DeterminismError(fromName,transitionName)

		let existTransFromTo = from.transitions.find(x => x.to == toName)

		if (existTransFromTo)
			existTransFromTo.label += transitionName
		else
			from.addTransition(new Transition(transitionName,fromName,toName))
	}
}