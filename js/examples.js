import DFA from "./DFA.js"
import NFA from "./NFA.js"
import NFAe from "./NFA-e.js"

const automDFA = new DFA("dfa", ['0','1'])
const automDFA_str1 = "0100101011"
const automDFA_str2 = "01000101011"

automDFA.addState('q0', true)
automDFA.addState('0')
automDFA.addState('00')
automDFA.addState('000', false, true)

automDFA.addTransition('1','q0','q0')
automDFA.addTransition('0','q0','0')
automDFA.addTransition('1','0','q0')
automDFA.addTransition('0','0','00')
automDFA.addTransition('1','00','q0')
automDFA.addTransition('0','00','000')
automDFA.addTransition('0/1','000','000')

const automNFA = new NFA("nfa", ['0','1'])
const automNFA_str1 = "01001010110"

automNFA.addState('q0',true)
automNFA.addState('q1')
automNFA.addState('q2',false,true)

automNFA.addTransition('0/1','q0','q0')
automNFA.addTransition('0','q0','q1')
automNFA.addTransition('1','q1','q2')

// automNFA.addState('q0', true)
// automNFA.addState('q1')
// automNFA.addState('q2')
// automNFA.addState('q3', false,true)

// automNFA.addTransition('0/1','q0','q0')
// automNFA.addTransition('1','q0','q1')
// automNFA.addTransition('0/1','q1','q2')
// automNFA.addTransition('0/1','q2','q3')

const automNFAe = new NFAe("nfae", ['0','1','2','3','4','5','6','7','8','9','-','.'])
const automNFAe_str1 = "5.08"
automNFAe.addState('q0',true)
automNFAe.addState('q1')
automNFAe.addState('q2')
automNFAe.addState('q3')
automNFAe.addState('q4',false,true)
automNFAe.addState('q5')

automNFAe.addTransition('epsilon/-','q0','q1')
automNFAe.addTransition('.','q1','q2')
automNFAe.addTransition('0/1/2/3/4/5/6/7/8/9','q1','q1')
automNFAe.addTransition('0/1/2/3/4/5/6/7/8/9','q1','q5')
automNFAe.addTransition('0/1/2/3/4/5/6/7/8/9','q5','q5')
automNFAe.addTransition('0/1/2/3/4/5/6/7/8/9','q2','q3')
automNFAe.addTransition('0/1/2/3/4/5/6/7/8/9','q3','q3')
automNFAe.addTransition('epsilon','q3','q4')
automNFAe.addTransition('epsilon','q5','q4')

const automNFAe_dfa = new NFAe("nfae",['0','1'])
automNFAe_dfa.addState('q0',true)
automNFAe_dfa.addState('q1')
automNFAe_dfa.addState('q2')
automNFAe_dfa.addState('q3',false,true)
automNFAe_dfa.addState('q4')
automNFAe_dfa.addState('q5')

automNFAe_dfa.addTransition('epsilon','q0','q1')
automNFAe_dfa.addTransition('epsilon','q0','q4')
automNFAe_dfa.addTransition('1','q1','q2')
automNFAe_dfa.addTransition('1','q4','q5')
automNFAe_dfa.addTransition('epsilon','q5','q1')
automNFAe_dfa.addTransition('0','q2','q2')
automNFAe_dfa.addTransition('epsilon/1','q2','q3')

// automNFAe_dfa.addState('q0',true)
// automNFAe_dfa.addState('q1',false,true)
// automNFAe_dfa.addState('q2')
// automNFAe_dfa.addState('q3')
// automNFAe_dfa.addState('q4',false,true)

// automNFAe_dfa.addTransition('1','q0','q1')
// automNFAe_dfa.addTransition('epsilon','q0','q2')
// automNFAe_dfa.addTransition('epsilon','q2','q3')
// automNFAe_dfa.addTransition('epsilon','q3','q4')
// automNFAe_dfa.addTransition('0','q4','q4')

exports.getDFA = function getDFA(){
	return automDFA
}

exports.getNFA = function getNFA(){
	return automNFA
}

exports.getNFAe = function getNFAe(){
	return automNFAe_dfa//automNFAe
}