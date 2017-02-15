import Automaton, {State, Transition} from "./automaton"
import DFA from "./DFA"
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

	toDFA(){
		let newStates = new Set()
		let initialState = this.getInitialState()
		newStates.add(initialState.label)
		
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
		newStates = Array.from(newStates)
		let newDFA = new DFA(this.name+"-toDFA",alphabet)
		newDFA.addState(normalizeState(newStates[0]),true)
		for (let i = 1; i < newStates.length; i++) {
			newDFA.addState(normalizeState(newStates[i]),false,lookForFinal(this,newStates[i]))
		}

		for(let i = 0; i < stateTable.length; i++){
			for(let j = 0; j < stateTable[i].length; j++){
				if (stateTable[i][j])
					newDFA.addTransition(alphabet[j],normalizeState(newStates[i]),normalizeState(stateTable[i][j]))
			}
		}

		return newDFA
	}
}

function normalizeState(state){
	return "{"+state.replaceAll('|',',')+"}"
}

function getStateTo(nfa,state,a) {
	let statesTo = new Set()

	let statesLabes = state.split('|')
	for(let s of statesLabes){
		let Astate = nfa.findState(s)

		if (Astate) {
			Astate.transitions.filter(x => x.match(a)).forEach(t => {
				statesTo.add(nfa.findState(t.to).label)
			})
		}
	}

	return Array.from(statesTo).sort().join('|')
}

function lookForFinal(nfa,state){
	return state.split('|').map(x => nfa.findState(x)).filter(x => x.isFinal).length>0
}