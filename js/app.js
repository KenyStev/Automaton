import DFA from "./DFA"
import NewDFA from "./AutomatonFactory"

exports.NewDFA = NewDFA;

// (function(){
// 	document.getElementById('send-automaton').attachEvent('onclick',e => {
// 		let alphabet = document.getElementById('automaton-alphabet').value;
// 		alphabet = alphabet.split(/ |\/.,/)
// 		let word = document.getElementById('automaton-word').value

// 		let automaton = NewDFA(network.body.data,"nuevo",alphabet)

// 		console.log(automaton.match(word))
// 	})
// })

// const autom = new DFA("dfa", ['0','1'])

// autom.addState('q0', true)
// autom.addState('0', true)
// autom.addState('00', true)
// autom.addState('000', false, true)

// autom.addTransition('1','q0','q0')
// autom.addTransition('0','q0','0')
// autom.addTransition('1','0','q0')
// autom.addTransition('0','0','00')
// autom.addTransition('1','00','q0')
// autom.addTransition('0','00','000')
// autom.addTransition('0/1','000','000')

// console.log(JSON.stringify(autom))
// console.log("autom")
// console.log(autom.match("0100101011"))
// console.log(autom.match("01000101011"))