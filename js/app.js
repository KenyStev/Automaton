import DFA from "./DFA"
import NFA from "./NFA"
import examples from "./examples"
import {
	NewDFA
, 	NewNFA
,	NewNFAe
,	NewPDA
,	NewTuring
,	regexToNFAe
,	regexToNFAe_STEPS
,	unionAutomaton
,	intersectionAutomaton
,	differenceAutomaton
,	complementAutomaton
,	grammarToPDA
} from "./AutomatonFactory"
import Parser from "./regular-expression-parser/regular-expression"
// import vis from "../node_modules/vis"

exports.examples = examples
exports.NewDFA = NewDFA;
exports.NewNFA = NewNFA;
exports.NewNFAe = NewNFAe;
exports.NewPDA = NewPDA;
exports.NewTuring = NewTuring;
exports.regexToNFAe = regexToNFAe;
exports.regexToNFAe_STEPS = regexToNFAe_STEPS;
exports.unionAutomaton = unionAutomaton;
exports.intersectionAutomaton = intersectionAutomaton;
exports.differenceAutomaton = differenceAutomaton;
exports.complementAutomaton = complementAutomaton;
exports.grammarToPDA = grammarToPDA;