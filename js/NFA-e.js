import Automaton, {State, Transition} from "./automaton"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError 
} from "./errors"

const epsilon = "epsilon"

export default class NFAe extends Automaton{
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
			if (!this.alphabet.has(c) && c!=epsilon)
				throw new UnknownCharError(c)
		})

		from.addTransition(new Transition(transitionName,fromName,toName))
	}

	clausura(state){
		let states = []
		states.push(state)
		state.transitions.filter(x => x.match(epsilon)).map(f => {
			states.push(this.findState(f.to))
		})

		return states
	}

	match(w,currentStates){
		console.log(`W: ${w} - len: ${w.length} state:`)
		console.log("currentStates")
		console.log(currentStates)
		
		let clausuras = []
		currentStates.forEach(currentState => {
			let tempClausuras = this.clausura(currentState)
			tempClausuras.forEach(claus => clausuras.push(claus))
		})

		console.log("clausuras")
		console.log(clausuras)

		if (w.length>0) {
			let a = w.charAt(0)
			let statesTo = new Set()

			clausuras.forEach(claus => {
				let transitions = claus.transitions.filter(x => x.match(a))
				transitions.forEach(t => statesTo.add(this.findState(t.to)))
			})

			return this.match(w.substring(1,w.length),Array.from(statesTo))
		}
		return clausuras.filter(x => x.isFinal)[0]
	}
}