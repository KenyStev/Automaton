import Automaton, { State, Transition } from "./automaton.js"

const autom = new Automaton("dfa", [0,1])
autom.addState(new State("q0",true))
autom.addState(new State("q1"))
autom.addState(new State("q2",false,true))

autom.addTransition(new Transition("0","q0","q1"))
autom.addTransition(new Transition("0","q1","q2"))
autom.addTransition(new Transition("1","q1","q0"))

console.log(autom)