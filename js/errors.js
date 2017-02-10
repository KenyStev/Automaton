export class UnknownCharError extends Error {
    constructor(unknownChar) {
        super(`Character '${unknownChar}' is not a part of the alphabet.`)
    }
}

export class UnknownStateError extends Error {
    constructor(stateName) {
        super(`State '${stateName}' does not exist in the automata.`)
    }
}

export class StateAlreadyExistError extends Error {
    constructor(stateName) {
        super(`State '${stateName}' already exist in the automata.`)
    }
}

export class DeterminismError extends Error {
    constructor(state, a) {
        super(`State '${state}' already has a transition with character '${a}'.`)
    }
} 

export class NextTransitionError extends Error {
	constructor(transition) {
        super(`Transition '${transition}' not valid.`)
    }
}