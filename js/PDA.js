import Automaton, {State, Transition} from "./automaton"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError,
		AlreadyMinimizedError
} from "./errors"

const epsilon = "epsilon"

export default class PDA extends Automaton{
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

		// transitionName.split(/,|\//).forEach(c => {
		// 	if (!this.alphabet.has(c) && c!=epsilon)
		// 		throw new UnknownCharError(c)
		// })

		from.addTransition(new Transition(transitionName,fromName,toName))
	}

	clausura(state,top){
		let states = []
		states.push(state)
		state.transitions.filter(x => x.ableToPop(epsilon,top)).map(f => {
			let epsilonState = this.findState(f.to)
			states.push(epsilonState)
			states = states.concat(states,this.clausura(epsilonState))
		})

		return Array.from(new Set(states))
	}

	match(w){
		let stack = []
		stack.push('Z0')
		return this.matchStates(w,[this.getInitialState()],stack)
	}

	matchStates(w,currentStates,stack){
		console.log("descripcion instantanea: w: %s, currentStates: %o, stack: %o",w,currentStates,stack)
		let clausuras = []
		currentStates.forEach(currentState => {
			let tempClausuras = this.clausura(currentState,stack[stack.length-1])
			tempClausuras.forEach(claus => clausuras.push(claus))
		})

		console.log("clausuras ", clausuras)

		if (w.length>0) {
			let a = w.charAt(0)
			let statesTo = new Set()
			let returnValues = []

			clausuras.forEach(claus => {
				let transitions = claus.transitions.filter(x => x.ableToPop(a,stack[stack.length-1]))
				transitions.forEach(t => {
					// statesTo.add(this.findState(t.to))
					let popValue = t.label.split('/')[0].split(',')[1]
					let pushValues = t.label.split('/')[1].split(',')
					let nextStack = Array.from(stack)
					if (popValue!=epsilon) nextStack.pop()
					for (var i = pushValues.length - 1; i >= 0; i--) {
						if (pushValues[i]!=epsilon)
							nextStack.push(pushValues[i])
					};
					returnValues = returnValues.concat(returnValues,this.matchStates(w.substring(1,w.length),[this.findState(t.to)],nextStack))
				})
			})
			return returnValues
			// if (statesTo.size==0)
			// 	throw new NextTransitionError(a)
			// return this.matchStates(w.substring(1,w.length),Array.from(statesTo),new Array(stack))
		}
		return clausuras.filter(x => x.isFinal)[0]
	}
}