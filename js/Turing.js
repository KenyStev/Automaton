import Automaton, {State, Transition} from "./automaton"
import { UnknownCharError, 
	UnknownStateError, 
	DeterminismError, 
	StateAlreadyExistError,
	NextTransitionError,
	AlreadyMinimizedError,
	NotValidWordError
} from "./errors"

const B = "B"
const right = "->"
const left = "<-"

export default class Turing extends Automaton{
	constructor(name, alphabet){
		super(name, alphabet)
		this.tape = []
		this.currentTape = 1
	}

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

		from.addTransition(new Transition(transitionName,fromName,toName))
	}

	match(w){
		this.tape = []
		this.currentTape = 1
		this.tape = w.split('')
		this.tape.unshift(B)
		this.tape.push(B)
		console.log(this.tape)

		let finalState = this.matchStates(this.getInitialState())
		console.log(finalState)
		if (!finalState) throw new NotValidWordError(w)
			return finalState
	}

	matchStates(currentState){
		if (!currentState.isFinal) {
			for(let transition of currentState.transitions){
				let stateTo = this.findState(transition.to)
				let values = transition.label.split('/')
				let read = values[0]
				let writeAndDir = values[1].split(' ')
				console.log('currentTape: %d',this.currentTape)
				console.log('read: %s',read)
				if (read==this.tape[this.currentTape]) {
					this.tape[this.currentTape] = writeAndDir[0]
					if (left==writeAndDir[1])
						this.currentTape--
					else if (right==writeAndDir[1])
						this.currentTape++
					console.log('read: %s -> write: %s',read,writeAndDir[0])
					console.log('currentTape: %d',this.currentTape)
					console.log('tape: %o',this.tape)
					return this.matchStates(stateTo)
				}
			}
		}

		return currentState
	}
}