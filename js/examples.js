import DFA from "./DFA.js"
import NFA from "./NFA.js"
import NFAe from "./NFA-e.js"
import PDA from "./PDA.js"

const automDFA = new DFA("dfa-tres ceros seguidos", ['0','1'])
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

const automDFA2 = new DFA("dfa-termina en 1",['0','1'])
automDFA2.addState('q0', true,true)
automDFA2.addState('q1')

automDFA2.addTransition('1','q0','q0')
automDFA2.addTransition('0','q0','q1')
automDFA2.addTransition('0','q1','q1')
automDFA2.addTransition('1','q1','q0')

const comienzaEnCero = new DFA("comienza en cero",['0','1'])
comienzaEnCero.addState('q0',true)
comienzaEnCero.addState('q1',false,true)

comienzaEnCero.addTransition('0','q0','q1')
comienzaEnCero.addTransition('0/1','q1','q1')

const toMinimize = new DFA("to minimize",['0','1'])
toMinimize.addState('A',true)
toMinimize.addState('B')
toMinimize.addState('C',false,true)
toMinimize.addState('D')
toMinimize.addState('E')
toMinimize.addState('F')
toMinimize.addState('G')
toMinimize.addState('H')

toMinimize.addTransition('0','A','B')
toMinimize.addTransition('1','A','F')
toMinimize.addTransition('0','B','G')
toMinimize.addTransition('1','B','C')
toMinimize.addTransition('0','C','A')
toMinimize.addTransition('1','C','C')
toMinimize.addTransition('0','D','C')
toMinimize.addTransition('1','D','G')
toMinimize.addTransition('0','E','H')
toMinimize.addTransition('1','E','F')
toMinimize.addTransition('0','F','C')
toMinimize.addTransition('1','F','G')
toMinimize.addTransition('0','G','G')
toMinimize.addTransition('1','G','E')
toMinimize.addTransition('0','H','G')
toMinimize.addTransition('1','H','C')

const DFAposhitoLoco = new DFA('poshito loco',["a","b","c"])
DFAposhitoLoco.addState('q0',true,true)
DFAposhitoLoco.addState('q1',false,true)
DFAposhitoLoco.addState('q2',false,true)
DFAposhitoLoco.addState('q3',false,true)
DFAposhitoLoco.addState('q4',false,true)
DFAposhitoLoco.addState('q5',false,true)
DFAposhitoLoco.addState('q6',false,true)
DFAposhitoLoco.addState('q7',false,true)
DFAposhitoLoco.addState('q8',false,true)
DFAposhitoLoco.addState('q9',false,true)
DFAposhitoLoco.addTransition('a','q0','q1')
DFAposhitoLoco.addTransition('b','q0','q4')
DFAposhitoLoco.addTransition('c','q0','q8')
DFAposhitoLoco.addTransition('a','q1','q2')
DFAposhitoLoco.addTransition('b','q1','q1')
DFAposhitoLoco.addTransition('a','q2','q3')
DFAposhitoLoco.addTransition('b','q2','q2')
DFAposhitoLoco.addTransition('a','q3','q1')
DFAposhitoLoco.addTransition('b','q3','q3')
DFAposhitoLoco.addTransition('a/c','q4','q5')
DFAposhitoLoco.addTransition('a/c','q5','q6')
DFAposhitoLoco.addTransition('a/c','q6','q7')
DFAposhitoLoco.addTransition('a/c','q7','q4')
DFAposhitoLoco.addTransition('a','q8','q9')
DFAposhitoLoco.addTransition('b','q9','q8')

const automNFA = new NFA("nfa-termina en 01", ['0','1'])
const automNFA_str1 = "01001010110"

automNFA.addState('q0',true)
automNFA.addState('q1')
automNFA.addState('q2',false,true)

automNFA.addTransition('0/1','q0','q0')
automNFA.addTransition('0','q0','q1')
automNFA.addTransition('1','q1','q2')

const automNFA2 = new NFA("nfa-antepenultino es 1", ['0','1'])

automNFA2.addState('q0', true)
automNFA2.addState('q1')
automNFA2.addState('q2')
automNFA2.addState('q3', false,true)

automNFA2.addTransition('0/1','q0','q0')
automNFA2.addTransition('1','q0','q1')
automNFA2.addTransition('0/1','q1','q2')
automNFA2.addTransition('0/1','q2','q3')

const automNFAe = new NFAe("nfae-los nums R enteros y decimales", ['0','1','2','3','4','5','6','7','8','9','-','.'])
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

const automNFAe_dfa = new NFAe("nfae-maximo de dos 1s seguido de muchos ceros  y termina en 1",['0','1'])
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

const automNFAe_dfa2 = new NFAe("nfae-un 1 o muchos ceros",['0','1'])

automNFAe_dfa2.addState('q0',true)
automNFAe_dfa2.addState('q1',false,true)
automNFAe_dfa2.addState('q2')
automNFAe_dfa2.addState('q3')
automNFAe_dfa2.addState('q4',false,true)

automNFAe_dfa2.addTransition('1','q0','q1')
automNFAe_dfa2.addTransition('epsilon','q0','q2')
automNFAe_dfa2.addTransition('epsilon','q2','q3')
automNFAe_dfa2.addTransition('epsilon','q3','q4')
automNFAe_dfa2.addTransition('0','q4','q4')

const termina_01_010 = new NFAe("termina en 01 o 010",['0','1'])

termina_01_010.addState('q0',true)
termina_01_010.addState('q1')
termina_01_010.addState('q2')
termina_01_010.addState('q3',false,true)

termina_01_010.addTransition('0/1','q0','q0')
termina_01_010.addTransition('0','q0','q1')
termina_01_010.addTransition('1','q1','q2')
termina_01_010.addTransition('0/epsilon','q2','q3')

const regex1 = {regex: "(1+0.(0)*.1)*", name: "termina en 1"}
const regex2 = {regex: "(0.(0)*)+(1)", name: "muchos ceros o un uno"}
const regex3 = {regex: "(0+1)*.1.(0+1).(0+1)", name: "antepenultino 1"}

//PDA
const ceros_unos_orden = new PDA("0^n 1^n",['0','1'])
ceros_unos_orden.addState('q0',true)
ceros_unos_orden.addState('q1')
ceros_unos_orden.addState('q2',false,true)

ceros_unos_orden.addTransition('0,Z0/X,Z0','q0','q0')
ceros_unos_orden.addTransition('0,X/X,X','q0','q0')
ceros_unos_orden.addTransition('1,X/epsilon','q0','q1')
ceros_unos_orden.addTransition('epsilon,Z0/Z0','q0','q1')
ceros_unos_orden.addTransition('1,X/epsilon','q1','q1')
ceros_unos_orden.addTransition('epsilon,Z0/Z0','q1','q2')

const parentesis = new PDA("consume parentesis",['(',')'])
parentesis.addState('q0',true,true)
parentesis.addState('q1')
parentesis.addTransition('epsilon,epsilon/$','q0','q1')
parentesis.addTransition('epsilon,$/epsilon','q1','q0')
parentesis.addTransition('(,epsilon/*','q1','q1')
parentesis.addTransition('),*/epsilon','q1','q1')

const palindromoPar = new PDA("ww^r",['0','1'])
palindromoPar.addState('q0',true)
palindromoPar.addState('q1')
palindromoPar.addState('q2')
palindromoPar.addState('q3',false,true)

palindromoPar.addTransition('0,Z0/0,Z0','q0','q0')
palindromoPar.addTransition('0,0/0,0','q0','q0')
palindromoPar.addTransition('1,0/1,0','q0','q0')
palindromoPar.addTransition('1,1/1,1','q0','q0')
palindromoPar.addTransition('1,Z0/Z0','q0','q0')
palindromoPar.addTransition('0,1/0,1','q0','q0')

palindromoPar.addTransition('0,0/epsilon','q1','q1')
palindromoPar.addTransition('1,1/epsilon','q2','q2')

palindromoPar.addTransition('epsilon,0/0','q0','q1')
palindromoPar.addTransition('epsilon,1/1','q0','q2')
palindromoPar.addTransition('1,1/epsilon','q1','q2')
palindromoPar.addTransition('0,0/epsilon','q2','q1')
palindromoPar.addTransition('epsilon,Z0/Z0','q1','q3')
palindromoPar.addTransition('epsilon,Z0/Z0','q2','q3')

exports.getDFA = function getDFA(){
	let listToLoad = [automDFA,automDFA2,comienzaEnCero,toMinimize,DFAposhitoLoco]
	listToLoad = listToLoad.map(x => {
		return {name: x.name,
				alphabet: Array.from(x.alphabet),
				dataset: x.toDataSet()}})
	return listToLoad
}

exports.getNFA = function getNFA(){
	let listToLoad = [automNFA,automNFA2]
	listToLoad = listToLoad.map(x => {
		return {name: x.name,
				alphabet: Array.from(x.alphabet),
				dataset: x.toDataSet()}})
	return listToLoad
}

exports.getNFAe = function getNFAe(){
	let listToLoad = [automNFAe,automNFAe_dfa,automNFAe_dfa2,termina_01_010]
	listToLoad = listToLoad.map(x => {
		return {name: x.name,
				alphabet: Array.from(x.alphabet),
				dataset: x.toDataSet()}})
	return listToLoad
}

exports.getRegex = function getRegex(){
	return [regex1,regex2,regex3]
}

exports.getPDA = function getPDA(){
	let listToLoad = [ceros_unos_orden,parentesis,palindromoPar]
	listToLoad = listToLoad.map(x => {
		return {name: x.name,
				alphabet: Array.from(x.alphabet),
				dataset: x.toDataSet()}})
	return listToLoad
}