import Automaton, {State, Transition} from "./automaton"
import DFAre from "./DFA-RE"
import { UnknownCharError, 
		UnknownStateError, 
		DeterminismError, 
		StateAlreadyExistError,
		NextTransitionError 
} from "./errors"

var contter = 0

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
		let dfa = new DFA("selected final state: "+state.label,Array.from(this.alphabet))
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
			regex.push('('+a.getRegex()+')')
		}
		// console.log("regex")
		// console.log(regex.join('+'))
		return {regex: regex.join('+'), stepByStep: automatons}
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

		// console.log(SetOfStepByStep)
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
			let stateToDelete = data.nodes.find(x => !(x.isInitial || x.isFinal))
			if (stateToDelete){
				let fromEdges = data.edges.filter(x => (x.from == stateToDelete.label && x.to != x.from))
				let toEdges = data.edges.filter(x => (x.to == stateToDelete.label && x.to != x.from))
				let cerraduraEdge = data.edges.find(x => (x.to == stateToDelete.label && x.to == x.from))
				if (cerraduraEdge)
					toEdges.forEach(edge => edge.label += '.('+cerraduraEdge.label+')*')

				let currentAutomaton = new DFAre("deleted state: "+stateToDelete.label,Array.from(backAutomaton.alphabet))

				data.nodes.filter(x => x.label != stateToDelete.label).forEach(state => {
					currentAutomaton.addState(state.label,state.isInitial,state.isFinal)
				})
				
				data.edges.filter(x => (x.from != stateToDelete.label && x.to != stateToDelete.label)).forEach(trans => {
					currentAutomaton.addTransition(trans.label, trans.from, trans.to)
				})

				toEdges.forEach(x => {
					fromEdges.forEach(y => {
						let newLabel = x.label+'.'+y.label
						currentAutomaton.addTransition(newLabel,x.from,y.to)
					})
				})

				stepByStep.push(currentAutomaton)
				backAutomaton = currentAutomaton
			}
		}
		return stepByStep
	}

	minimize(){
		let visitados = []
		let equivalentes = []
		let colStates = this.states.slice(1,this.states.length)
		let rowStates = this.states.slice(0,this.states.length-1)

		for(let col of colStates){
			for(let row of rowStates){
				contter = 0
				visitados = []
				if (col.label != row.label)
					this.DFS(col,row,visitados,equivalentes)
			}
		}
		console.log(JSON.stringify(equivalentes))
		return this.mergeEquivalents(equivalentes)
	}

	DFS(Q,P,V,E){
		if(contter>500) {console.log("recursion infinita"); return}
		else contter++
		let visited = V.find(x => (x.Q.label == Q.label && x.P.label == P.label) 
			|| (x.Q.label == P.label && x.P.label == Q.label)) != null || false
		if(!visited)
			V.push({Q: Q, P: P})

		if (this.areEquivalents(Q,P,E)) return
		let lamdaResults = []

		console.log(Q.label+' vs '+P.label)
		for(let a of this.alphabet){
			let toQ = Q.transitions.find(x => x.match(a))
			let toP = P.transitions.find(x => x.match(a))
			if (toQ && toP) {
				toQ = this.findState(toQ.to)
				toP = this.findState(toP.to)
				console.log("&("+Q.label+","+a+") = "+toQ.label)
				console.log("&("+P.label+","+a+") = "+toP.label)
				lamdaResults.push({toQ: toQ,toP:toP})
			}
		}
		console.log('-------------------------------')
		let EQ = true
		for(let lr of lamdaResults){
			if (lr.toQ.isFinal != lr.toP.isFinal) {EQ = false; break}
			let visitedTo = V.find(x => (x.Q.label == lr.toQ.label && x.P.label == lr.toP.label) 
				|| (x.Q.label == lr.toP.label && x.P.label == lr.toQ.label)) != null || false
			if (lr.toQ.label != lr.toP.label && lr.toQ.isFinal == lr.toP.isFinal){
				if (!visitedTo){
					this.DFS(lr.toQ,lr.toP,V,E)
					EQ = this.areEquivalents(lr.toQ,lr.toP,E)
				}
			}
		}
		
		if (EQ && Q.isFinal == P.isFinal && !this.areEquivalents(Q,P,E)) {
			console.log("EQ: "+Q.label+' - '+P.label)
			E.push({Q1: Q, Q2: P})
		}
	}

	mergeEquivalents(E){
		let automatonMin = new DFA("minimized: "+this.name,Array.from(this.alphabet))
		let newStates = []
		let newTransitions = new Set()

		for(let e of E){
			let newState = new Set()
			newState.add(e.Q1.label)
			newState.add(e.Q2.label)
			let isStillInitial = e.Q1.isInitial || e.Q2.isInitial
			if(newStates.filter(x => x.label.indexOf(e.Q1.label)>=0 || x.label.indexOf(e.Q2.label)>=0).length>0) continue
			let duplicated = E.filter(x => x.Q1.label == e.Q1.label || x.Q1.label == e.Q2.label 
				|| x.Q2.label == e.Q1.label || x.Q2.label == e.Q2.label)
			for(let d of duplicated){
				newState.add(d.Q1.label)
				newState.add(d.Q2.label)
				isStillInitial = isStillInitial || d.Q1.isInitial || d.Q2.isInitial
				E = E.filter(x => x.Q1.label != d.Q1.label && x.Q2.label != d.Q2.label)
			}
			let newStateLabel = Array.from(newState).sort().join(',')
			newStates.push({
				label:newStateLabel,
				isInitial:isStillInitial,
				isFinal:e.Q1.isFinal})

			for(let ns of newState){
				let state = this.findState(ns)
				state.transitions.forEach(trans => {
					let equivalent = newStates.find(x => x.label.indexOf(trans.to)>=0)
					let nt = undefined
					if(equivalent){
						nt = {
							label:trans.label,
							from:newStateLabel,
							to:equivalent.label
						}
					}
					else{
						nt = {
							label:trans.label,
							from:newStateLabel,
							to:trans.to
						}
					}
					if(nt && !Array.from(newTransitions).find(x => x.label == nt.label 
						&& x.from == nt.from && x.to == nt.to))
						newTransitions.add(nt)
				})
			}
		}

		for(let state of newStates){
			automatonMin.addState(state.label,state.isInitial,state.isFinal)
		}

		for(let state of this.states){
			// E.find(x => (x.Q1.label == state.label) || (x.Q2.label == state.label))
			if(!newStates.find(x => (x.label.indexOf(state.label)>=0) || (x.label.indexOf(state.label)>=0))){
				automatonMin.addState(state.label,state.isInitial,state.isFinal)
				state.transitions.forEach(trans => {
					// let stateTo = this.findState(trans.to)
					let equivalent = newStates.find(x => (x.label.indexOf(trans.to)>=0) || (x.label.indexOf(trans.to)>=0))
					if (equivalent){
						newTransitions.add({
							label:trans.label,
							from: trans.from,
							to: equivalent.label
						})
					}
					else{
						newTransitions.add({
							label:trans.label,
							from: trans.from,
							to: trans.to
						})
					}
				})
			}
		}

		console.log("newStates & newTransitions")
		console.log(JSON.stringify({newStates: newStates,newTransitions: Array.from(newTransitions)}))
		for(let nt of newTransitions){
			automatonMin.addTransition(nt.label,nt.from,nt.to)
		}
		return automatonMin
	}

	areEquivalents(Q,P,E){
		return (E.find(x => (x.Q1.label == Q.label && x.Q2.label == P.label) 
					|| (x.Q1.label == P.label && x.Q2.label == Q.label))) != null || false
	}
}

function normalizeLabel (trans) {
	let satandBy = trans.label.replaceAll('.','\\.').replaceAll('+','\\+').replaceAll('*','\\*')
	let setOfChars = satandBy.split(/,|\//)
	if (setOfChars.length>1) {setOfChars = '('+setOfChars.join('+')+')'}
	else setOfChars = setOfChars[0]
	return setOfChars
}