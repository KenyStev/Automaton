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
		// let initialState = this.getInitialState()
		// let secondState = this.states.filter(x => x.label != initialState.label)
		let colStates = this.states.slice(1,this.states.length)
		let rowStates = this.states.slice(0,this.states.length-1)

		for(let col of colStates){
			for(let row of rowStates){
				contter = 0
				visitados = []
				if (col.label != row.label)
					this.DPS(col,row,visitados,equivalentes)
			}
		}
		// for(let state of secondState){
		// 	contter = 0
		// 	visitados = []
		// 	this.DPS(initialState,state,visitados,equivalentes)
		// }

		console.log(JSON.stringify(equivalentes))
	}

	DPS(Q,P,V,E){
		if(contter>500) {console.log("recursion infinita"); return}
		else contter++
		let visited = V.find(x => (x.Q.label == Q.label && x.P.label == P.label) 
			|| (x.Q.label == P.label && x.P.label == Q.label)) != null || false
		if(!visited)
			V.push({Q: Q, P: P})
		// else if (Q.isFinal == P.isFinal && ) {};

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
					this.DPS(lr.toQ,lr.toP,V,E)
					EQ = this.areEquivalents(lr.toQ,lr.toP,E)
				}
			}
		}
		console.log("EQ: "+EQ)
		if (EQ && Q.isFinal == P.isFinal && !this.areEquivalents(Q,P,E)) {
			console.log("added: "+Q.label+' - '+P.label)
			E.push({Q1: Q, Q2: P})
		}
		// V = V.filter(x => (x.Q.label != Q.label && x.P.label != P.label) 
			// || (x.Q.label != P.label && x.P.label != Q.label))
		
		// let visited = V.find(x => x.Q == Q && x.P == P || x.Q == P && x.P == Q) != null || false
		// // console.log("visited: "+visited)
		// if (visited && (Q.isFinal == P.isFinal) && !this.areEquivalents(Q,P,E)) {
		// 	console.log("added visited: "+Q.label+' - '+P.label)
		// 	E.push({Q1: Q, Q2: P}); 
		// 	return
		// }
		// if (this.areEquivalents(Q,P,E)) return
		// V.push({Q: Q, P: P})
		// // console.log("EQ: "+this.areEquivalents(Q,P,E))
		// // console.log("Q.isFinal != P.isFinal: "+(Q.isFinal != P.isFinal))
		// // if (Q.isFinal != P.isFinal) return
		// let lamdaResults = []
		// let EQ = true
		// // if (!visited){
		// console.log(Q.label+' vs '+P.label)
		// for(let a of this.alphabet){
		// 	let toQ = Q.transitions.find(x => x.match(a))
		// 	let toP = P.transitions.find(x => x.match(a))
		// 	if (toQ && toP) {
		// 		toQ = this.findState(toQ.to)
		// 		toP = this.findState(toP.to)
		// 		console.log("&("+Q.label+","+a+") = "+toQ.label)
		// 		console.log("&("+P.label+","+a+") = "+toP.label)
		// 		lamdaResults.push({toQ: toQ,toP:toP})

		// 		// if (toQ.label != toP.label) {
					
		// 		// 	EQ = this.areEquivalents(toQ,toP,E)
		// 		// 	console.log("EQ en distintos: "+EQ)
		// 		// }else{
		// 		// 	EQ = true
		// 		// }
		// 	}
		// }
		// console.log('-------------------------------')
		// for(let lr of lamdaResults){
		// 	if (lr.toQ.isFinal != lr.toP.isFinal) EQ = false
		// 	if (lr.toQ.label != lr.toP.label && lr.toQ.isFinal == lr.toP.isFinal){
		// 		this.DPS(lr.toQ,lr.toP,V,E)
		// 		EQ = this.areEquivalents(lr.toQ,lr.toP,E)
		// 	}
		// }
		// // }
		// if (EQ && Q.isFinal == P.isFinal && !this.areEquivalents(Q,P,E)) {
		// 	console.log("added: "+Q.label+' - '+P.label)
		// 	E.push({Q1: Q, Q2: P})
		// }
		// // V = V.filter(x => x.Q != Q && x.P != P || x.Q != P && x.P != Q)
	}

	areEquivalents(Q,P,E){
		return (E.find(x => (x.Q1.label == Q.label && x.Q2.label == P.label) 
					|| (x.Q1.label == P.label && x.Q2.label == Q.label))) != null || false
	}

	// minimize(){
	// 	let tableData = this.getInitialTable()
	// 	contter = 0

	// 	for(let i=0;i<tableData.table.length;i++){
	// 		for(let j=0;j<tableData.table[i].length;j++){
	// 			if (tableData.table[i][j]==null){
	// 				this.markIfNoEquivalent(tableData,tableData.colStates[i],tableData.rowStates[j])
	// 			}
	// 		}
	// 	}

	// 	console.log(JSON.stringify(tableData))

	// }

	// getInitialTable(){
	// 	let dataset = this.toData()
	// 	let colStates = dataset.nodes.slice(1,dataset.nodes.length)
	// 	let rowStates = dataset.nodes.slice(0,dataset.nodes.length-1)
	// 	let row = 0
	// 	let tableMarks = []

	// 	for(let colState of colStates){
	// 		tableMarks.push(new Array(row+1))
	// 		let col = 0
	// 		for(let s of tableMarks[row]){
	// 			if (colStates[row].isFinal!=rowStates[col].isFinal)
	// 				tableMarks[row][col] = false
	// 			else
	// 				tableMarks[row][col] = null
	// 			col++
	// 		}
	// 		row++
	// 	}
	// 	return {colStates: colStates, rowStates:rowStates, table: tableMarks}
	// }

	// markIfNoEquivalent(data,Q,P){
	// 	contter++
	// 	if (contter>100){console.log("entrando a recursion infinita"); return}

	// 	let areEquivalents = true
	// 	let indexes = getIndexes(data,Q.label,P.label)
	// 	console.log(Q.label+' vs '+P.label)
	// 	restartLoop:
	// 	for(let a of this.alphabet){
	// 		let toQ = this.lamda(Q,a)
	// 		let toP = this.lamda(P,a)

	// 		console.log('/\\('+Q.label+','+a+') = '+toQ)
	// 		console.log('/\\('+P.label+','+a+') = '+toP+'\n')
	// 		if (indexes.Qindex<0 && indexes.Pindex<0) return
	// 		if ( toQ != null && toP != null){
	// 			let indexesTo = getIndexes(data,toQ,toP)
	// 			if (toQ != toP) {
	// 				let checked = data.table[indexesTo.Qindex][indexesTo.Pindex]
	// 				if (checked===null){
	// 					this.markIfNoEquivalent(data,this.findState(toQ),this.findState(toP))
	// 					continue restartLoop
	// 				}else{
	// 					areEquivalents = false
	// 				}
	// 			}
	// 		}
	// 	}
	// 	data.table[indexes.Qindex][indexes.Pindex] = areEquivalents
	// }

	// lamda(Q,a){
	// 	let state = this.findState(Q.label)
	// 	let trans = state.transitions.find(x => x.match(a))
	// 	if (trans)
	// 		return trans.to
	// 	return null
	// }
}

// function getIndexes(data,toQ,toP){
// 	let logicView = true
// 	let indexQ = -1
// 	let indexP = -1
// 	if (toQ == toP) return {Qindex: indexQ, Pindex: indexP}

// 	for (let i = 0; i < data.colStates.length; i++) {
// 		if (data.colStates[i].label==toQ){
// 			indexQ = i
// 			break
// 		}
// 	}
// 	let rowStates = data.rowStates
// 	if (indexQ<0){
// 		if (rowStates[0].label==toQ){
// 			indexQ = 0
// 		}
// 		else{
// 			return {Qindex: indexQ, Pindex: indexP}
// 		}

// 		rowStates = data.colStates
// 		logicView = false
// 	}

// 	for (let i = 0; i < rowStates.length; i++) {
// 		if (rowStates[i].label==toP){
// 			indexP = i
// 			break
// 		}
// 	}

// 	if (indexP>=0){
// 		if (logicView && (indexQ < indexP)) {
// 			indexQ++
// 			indexP--
// 		}
// 	}
// 	return {Qindex: indexQ, Pindex: indexP}
// }

function normalizeLabel (trans) {
	let satandBy = trans.label.replaceAll('.','\\.').replaceAll('+','\\+').replaceAll('*','\\*')
	let setOfChars = satandBy.split(/,|\//)
	if (setOfChars.length>1) {setOfChars = '('+setOfChars.join('+')+')'}
	else setOfChars = setOfChars[0]
	return setOfChars
}