import Automaton, {State, Transition} from "./automaton"
import DFA from "./DFA"
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
			let epsilonState = this.findState(f.to)
			states.push(epsilonState)
			states = states.concat(states,this.clausura(epsilonState))
		})

		return Array.from(new Set(states))
	}

	match(w,currentStates){
		let clausuras = []
		currentStates.forEach(currentState => {
			let tempClausuras = this.clausura(currentState)
			tempClausuras.forEach(claus => clausuras.push(claus))
		})

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

	toDFA(){
		let newStates = new Set()
		let initialState = this.getInitialState()
		newStates.add(this.clausura(initialState).map(x => x.label).join(','))
		// console.log(newStates)
		let alphabet = Array.from(this.alphabet)
		let stateTable = []

		let x = 0
		for(let state of newStates){
			stateTable.push(new Array(alphabet.length))
			let y = 0
			for(let a of alphabet){
				let stateTo = getStateTo(this,state,a)
				
				if (stateTo) {
					stateTable[x][y] = stateTo
					newStates.add(stateTo)
				}
				y += 1
			}
			x += 1
		}
		console.log(newStates)
		console.log(stateTable)
	}
}

function getStateTo(nfae,state,a) {
	let statesTo = new Set()

	let statesLabes = state.split(',')
	for(let s of statesLabes){
		let Astate = nfae.findState(s)

		if (Astate) {
			Astate.transitions.filter(x => x.label == a).forEach(t => {
				nfae.clausura(nfae.findState(t.to)).map(s => s.label).forEach(c => statesTo.add(c))
			})
		}
	}

	return Array.from(statesTo).join(',')
}