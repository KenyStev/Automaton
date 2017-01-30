import DFA from "./DFA.js"

const automDFA = new DFA("dfa", ['0','1'])
const automDFA_str1 = "0100101011"
const automDFA_str2 = "01000101011"

automDFA.addState('q0', true)
automDFA.addState('0', true)
automDFA.addState('00', true)
automDFA.addState('000', false, true)

automDFA.addTransition('1','q0','q0')
automDFA.addTransition('0','q0','0')
automDFA.addTransition('1','0','q0')
automDFA.addTransition('0','0','00')
automDFA.addTransition('1','00','q0')
automDFA.addTransition('0','00','000')
automDFA.addTransition('0/1','000','000')