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
// var contter = 0

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
			// states = states.concat(states,this.clausura(epsilonState,top))
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
				let transitions = claus.epsilonState.transitions.filter(x => x.ableToPop(a,stack[stack.length-1])
					|| x.ableToPop(a,epsilon)
					|| x.ableToPop(epsilon,stack[stack.length-1]))
				console.log("transitions")
				console.log(transitions)
				transitions.forEach(t => {
					let popValue = t.label.split('/')[0].split(',')[1]
					let pushValues = t.label.split('/')[1].split(',')
					if (popValue!=epsilon) nextStack.pop()
						for (var i = pushValues.length - 1; i >= 0; i--) {
							if (pushValues[i]!=epsilon)
								nextStack.push(pushValues[i])
						}
						console.log("llego aqui")
						if(t.label.split('/')[0].split(',')[0]!=epsilon)
							returnValues = returnValues.concat(returnValues,this.matchStates(w.substring(1,w.length),[this.findState(t.to)],nextStack))
						else
							returnValues = returnValues.concat(returnValues,this.matchStates(w,[this.findState(t.to)],nextStack))
					})
			})
console.log("returnValues")
console.log(returnValues)
return Array.from(new Set(returnValues))
}
return (clausuras.map(y => y.epsilonState)).find(x => x.isFinal)
}

toGrammar(){
	let grammar = this.getStepOne()
	let stepTwo = this.getStepTwo()
	let stepThree = this.getStepThree()

	let keys = Reflect.ownKeys(stepTwo)
	keys.forEach(key => {
		if (key in grammar) {
			grammar[key] = grammar[key].concat(grammar[key],stepTwo[key])
		}else{
			grammar[key] = stepTwo[key]
		}
	})

	keys = Reflect.ownKeys(stepThree)
	keys.forEach(key => {
		if (key in grammar) {
			grammar[key] = grammar[key].concat(grammar[key],stepThree[key])
		}else{
			grammar[key] = stepThree[key]
		}
	})

	keys = Reflect.ownKeys(grammar)
	let alphabet = Array.from(this.alphabet)

	for (let key of keys) {
		console.log("key: %s",key)
		console.log("grammar[key]: %o",grammar[key])
		for (var j = 0; j < grammar[key].length; j++) {
			console.log("grammar[key][j]: %o",grammar[key][j])
			for (var k = 0; k < grammar[key][j].length; k++) {
				console.log("grammar[key][j][k]: %o",grammar[key][j][k])
				if (grammar[key][j][k]!=epsilon && !keys.includes(grammar[key][j][k]) && !alphabet.includes(grammar[key][j][k])) {
					console.log("deleted: %s",grammar[key][j][k])
					grammar[key][j].splice(k,1)
					k=0
				}
			}	
		}	
	}

	for (let key of keys) {
		let setToDeleteDuplicateds = new Set()
		for (var j = 0; j < grammar[key].length; j++) {
			setToDeleteDuplicateds.add(grammar[key][j].join(','))
		}
		grammar[key] = Array.from(setToDeleteDuplicateds).map(x => x.split(','))
	}

	console.log(JSON.stringify(grammar,undefined,2))
	return grammar
}

getStepOne(){
	let initialState = this.getInitialState()
	let finalStates = this.states.filter(x => x.isFinal)
	let produced = []

	finalStates.forEach(state => {
		console.log('S -> ['+initialState.label+'Z0'+state.label+']')
		produced.push(['['+initialState.label+'Z0'+state.label+']'])
	})
	return {'S':produced}
}

getStepTwo(){
	let transitions = this.toData().edges
	let returnValues = {}
	transitions.forEach(trans => {
		let values = trans.label.split('/')
		let leftValues = values[0].split(',')
		if (values[1]==epsilon) {
			let production = '['+trans.from+leftValues[1]+trans.to+']'
			console.log(production+' -> '+leftValues[0])
			if (!returnValues[production]) returnValues[production] = []
				returnValues[production].push([leftValues[0]])
		}
	})
	return returnValues
}

getStepThree(){
	let returnValues = {}
	let data = this.toData()
	let transitions = data.edges
	transitions.forEach(trans => {
		let values = trans.label.split('/')
		let leftValues = values[0].split(',')
		let rightValues = values[1].split(',')
		let m = rightValues.length
		if (values[1]!=epsilon){
			let permutation = getPermutation(data.nodes,m)
			permutation.forEach(row => {
				let production = '[' + trans.from + leftValues[1] + row[m-1] + ']'
				let produce = leftValues[0] + ',['+trans.to+ rightValues[0]+ row[0] +']'
				for (var i = 1; i < rightValues.length; i++) {
					produce += ',[' + row[i-1] + rightValues[i] + row[i] + ']'
				}
				console.log(production + ' -> '+ produce)
				if (!returnValues[production]) returnValues[production] = []
					returnValues[production].push(produce.split(','))
			})
		}
	})
	return returnValues
}
}

function getPermutation(Q,m) {
	console.log("Start")
	let states = Q.map(x => x.label)
	let permutation = []
	let rows = Math.pow(states.length,m)
	
	for (let i = 0; i < rows; i++) {
		permutation.push(new Array(m))
	}

	for (let i = 0; i < m; i++) {
		// permutation.push(new Array(m))
		let incidences = Math.pow(states.length, m - (i + 1));
		let current_state = 0;
		for (let j = 0; j < rows; j++) {
			if (j > 0 && j % incidences == 0)
				current_state++;
			if (current_state >= states.length)
				current_state = 0;
			permutation[j][i] = states[current_state];
		}
	}

	for (var row = 0; row < rows; row++) {
		console.log("r: %d -> %s",row,JSON.stringify(permutation[row]))
	}

	return permutation
}