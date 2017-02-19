import DFA from "./DFA"
import NFA from "./NFA"
import examples from "./examples"
import {NewDFA, NewNFA,NewNFAe,regexToNFAe,regexToNFAe_STEPS} from "./AutomatonFactory"
import Parser from "./regular-expression-parser/regular-expression"
// import vis from "../node_modules/vis"

exports.examples = examples
exports.NewDFA = NewDFA;
exports.NewNFA = NewNFA;
exports.NewNFAe = NewNFAe;
exports.regexToNFAe = regexToNFAe;
exports.regexToNFAe_STEPS = regexToNFAe_STEPS;

// let output = Parser.parse('(1)+(1.(0+1).(0)*)+(1.(0+1).(0)*.1)');
// console.log(JSON.stringify(output));

// let output = Parser.parse('((1)*.0.(0)*.1.(0.(0)*.1)*.1)');
// console.log(JSON.stringify(output));