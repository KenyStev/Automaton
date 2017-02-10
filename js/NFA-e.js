import Automaton, {State, Transition} from "./automaton"
import DFA from "./DFA"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError 
} from "./errors"

const epsilon = "epsilon"

String.prototype.replaceAll = function(search, replacement) {
    var target = this
    return target.split(search).join(replacement)
}

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
			if (statesTo.size==0)
				throw new NextTransitionError(a)
			return this.match(w.substring(1,w.length),Array.from(statesTo))
		}
		return clausuras.filter(x => x.isFinal)[0]
	}

	toDFA(){
		let newStates = new Set()
		let initialState = this.getInitialState()
		newStates.add(this.clausura(initialState).map(x => x.label).sort().join('|'))
		
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

function getStateTo(nfae,state,a) {
	let statesTo = new Set()

	let statesLabes = state.split('|')
	for(let s of statesLabes){
		let Astate = nfae.findState(s)

		if (Astate) {
			Astate.transitions.filter(x => x.match(a)).forEach(t => {
				nfae.clausura(nfae.findState(t.to)).map(s => s.label).forEach(c => statesTo.add(c))
			})
		}
	}

	return Array.from(statesTo).sort().join('|')
}

function lookForFinal(nfae,state){
	return state.split('|').map(x => nfae.findState(x)).filter(x => x.isFinal).length>0
}