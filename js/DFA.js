import Automaton, {State, Transition} from "./automaton"
import DFAre from "./DFA-RE"
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
		if (!this.isDeterministic(from,transitionName))
			throw new DeterminismError(fromName,transitionName)

		let existTransFromTo = from.transitions.filter(x => x.to == toName)[0]

		if (existTransFromTo)
			existTransFromTo.label += "/" + transitionName
		else
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

	genereteDFA(state){
		let dfa = new DFA(this.name,Array.from(this.alphabet))
		this.states.forEach(s => {
			dfa.addState(s.label,s.isInitial,s.label == state.label)
		})
		this.states.forEach(s => {
			s.transitions.forEach(t => dfa.addTransition(t.label,t.from,t.to))
		})
		return dfa
	}

	toRE(){
		let automatons = this.toREstepByStep()
		let regex = []

		for(let as of automatons){
			let a = as[as.length-1]
			regex.push('['+a.getRegex()+']')
		}
		console.log("regex")
		console.log(regex.join('+'))
		return regex.join('+')
	}

	toREstepByStep(){
		let finalStates = this.states.filter(x => x.isFinal)
		let automatons = []
		let SetOfStepByStep = []

		for(let finalState of finalStates){
			automatons.push(this.genereteDFA(finalState))
		}

		for(let automaton of automatons){
			SetOfStepByStep.push(this.regexFor(automaton))
		}

		console.log(SetOfStepByStep)
		return SetOfStepByStep
	}

	regexFor(dfa){
		let stepByStep = []
		let backAutomaton = new DFAre(dfa.name+"-re",Array.from(dfa.alphabet))
		stepByStep.push(backAutomaton)

		dfa.states.forEach(state => {
			backAutomaton.addState(state.label,state.isInitial,state.isFinal)
		})
		dfa.states.forEach(state => {
			state.transitions.forEach(trans => {
				backAutomaton.addTransition(normalizeLabel(trans),trans.from,trans.to)
			})
		})

		let counter = (backAutomaton.states.filter(x => (x.isInitial && x.isFinal)).length>0)?1:2

		while(backAutomaton.states.length > counter){
			let data = backAutomaton.toData()
			// console.log("data")
			// console.log(data)
			let stateToDelete = data.nodes.find(x => !(x.isInitial || x.isFinal))
			// console.log("stateToDelete")
			// console.log(stateToDelete)
			if (stateToDelete){
				let fromEdges = data.edges.filter(x => (x.from == stateToDelete.label && x.to != x.from))
				// console.log("fromEdges")
				// console.log(fromEdges)
				let toEdges = data.edges.filter(x => (x.to == stateToDelete.label && x.to != x.from))
				// console.log("toEdges")
				// console.log(toEdges)
				let cerraduraEdge = data.edges.find(x => (x.to == stateToDelete.label && x.to == x.from))
				if (cerraduraEdge)
					toEdges.forEach(edge => edge.label += '('+cerraduraEdge.label+')*')

				let currentAutomaton = new DFAre(backAutomaton.name,Array.from(backAutomaton.alphabet))

				data.nodes.filter(x => x.label != stateToDelete.label).forEach(state => {
					currentAutomaton.addState(state.label,state.isInitial,state.isFinal)
				})
				
				data.edges.filter(x => (x.from != stateToDelete.label && x.to != stateToDelete.label)).forEach(trans => {
					currentAutomaton.addTransition(trans.label, trans.from, trans.to)
				})

				toEdges.forEach(x => {
					fromEdges.forEach(y => {
						let newLabel = x.label+y.label
						currentAutomaton.addTransition(newLabel,x.from,y.to)
					})
				})

				stepByStep.push(currentAutomaton)
				backAutomaton = currentAutomaton
			}
		}
		console.log("stepByStep")
		console.log(stepByStep)
		return stepByStep
	}
}

function normalizeLabel (trans) {
	let satandBy = trans.label.replaceAll('.','\\.').replaceAll('+','\\+').replaceAll('*','\\*')
	let setOfChars = satandBy.split(/,|\//)
	if (setOfChars.length>1) {setOfChars = '('+setOfChars.join('+')+')'}
	else setOfChars = setOfChars[0]
	return setOfChars
}