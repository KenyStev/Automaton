import Automaton, {State, Transition} from "./automaton"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError,
		AlreadyMinimizedError,
		NotValidWordError
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
		states.push({epsilonState: state, pushPop: 'epsilon,epsilon/epsilon'})
		state.transitions.filter(x => x.ableToPop(epsilon,top) || x.ableToPop(epsilon,epsilon)).map(f => {
			let epsilonState = this.findState(f.to)
			states.push({epsilonState: epsilonState, pushPop: f.label})
			states = states.concat(states,this.clausura(epsilonState))
		})

		return Array.from(new Set(states))
	}

	match(w){
		let stack = []
		stack.push('Z0')
		let finalStates = this.matchStates(w,[this.getInitialState()],stack)
		if (finalStates.length==0) throw new NotValidWordError(w)
		console.log("finalStates: %o", finalStates)
		let finalState = finalStates.find(x => x!=undefined && x.isFinal)
		if (!finalState) throw new NotValidWordError(w)
		return finalState
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
				let nextStack = Array.from(stack)
				let popEpsilonValue = claus.pushPop.split('/')[0].split(',')[1]
				let pushEpsilonValues = claus.pushPop.split('/')[1].split(',')

				if (popEpsilonValue!=epsilon) nextStack.pop()
				for (var i = pushEpsilonValues.length - 1; i >= 0; i--) {
					if (pushEpsilonValues[i]!=epsilon)
						nextStack.push(pushEpsilonValues[i])
				}
				let transitions = claus.epsilonState.transitions.filter(x => x.ableToPop(a,stack[stack.length-1]) || x.ableToPop(a,epsilon))
				transitions.forEach(t => {
					// statesTo.add(this.findState(t.to))
					let popValue = t.label.split('/')[0].split(',')[1]
					let pushValues = t.label.split('/')[1].split(',')
					if (popValue!=epsilon) nextStack.pop()
					for (var i = pushValues.length - 1; i >= 0; i--) {
						if (pushValues[i]!=epsilon)
							nextStack.push(pushValues[i])
					}
					returnValues = returnValues.concat(returnValues,this.matchStates(w.substring(1,w.length),[this.findState(t.to)],nextStack))
				})
			})
			// if (returnValues.length>0)
				return Array.from(new Set(returnValues))
			// if (statesTo.size==0)
			// 	throw new NextTransitionError(a)
			// return this.matchStates(w.substring(1,w.length),Array.from(statesTo),new Array(stack))
		}
		return (clausuras.map(y => y.epsilonState)).find(x => x.isFinal)
	}
}