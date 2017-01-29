import DFA from "./DFA.js"

const autom = new DFA("dfa", ['0','1'])
// autom.addState(new State("q0",true))
// autom.addState(new State("q1"))
// autom.addState(new State("q2",false,true))

// autom.addTransition(new Transition("0","q0","q1"))
// autom.addTransition(new Transition("0","q1","q2"))
// autom.addTransition(new Transition("1","q1","q0"))

autom.addState('q0', true)
autom.addState('0', true)
autom.addState('00', true)
autom.addState('000', false, true)

autom.addTransition('1','q0','q0')
autom.addTransition('0','q0','0')
autom.addTransition('1','0','q0')
autom.addTransition('0','0','00')
autom.addTransition('1','00','q0')
autom.addTransition('0','00','000')
autom.addTransition('0/1','000','000')

// autom.addState("q0",true)
// autom.addState("q1")
// autom.addState("q2",false,true)

// autom.addTransition("0","q0","q1")
// autom.addTransition("0","q1","q2")
// autom.addTransition("1","q1","q0")

console.log(autom)
console.log("autom")
console.log(autom.match("0100101011"))
console.log(autom.match("01000101011"))