String.prototype.replaceAll = function(search, replacement) {
    var target = this
    return target.split(search).join(replacement)
}

export default class Automaton {
	alphabet = undefined
	states = []
	constructor(name, alphabet){
		this.name = name
		this.setAlphabet(alphabet)
	}

	setAlphabet(alphabet) {
		this.alphabet = new Set()
		alphabet.forEach(c => {
			this.alphabet.add(c)
		})
	}

	addState(state) {
		this.states.push(state)
	}

	addTransition(transition) {
		const from = this.states.find(e => e.label == transition.from)
		from.addTransition(transition)
	}

	findState(stateName) {
		return this.states.find(e => e.label == stateName)
	}

	getInitialState(){
		return this.states.find(e => e.isInitial)
	}

	toDataSet(){
		let nodes = []
		let edges = []
		this.states.map(x => {
			nodes.push({nodeId: `${x.isInitial?'start':''}/${x.isFinal?'end':''}`,
				id: x.label, label: x.label, color: getStateColor(x)})
			x.transitions.map(t => {
				edges.push({from: t.from, to: t.to, label: t.label, font: {align: 'middle'}})
			})
		})
		return {nodes: nodes, edges: edges}
	}

	toData(){
		let nodes = []
		let edges = []
		this.states.map(x => {
			nodes.push({isInitial: x.isInitial, isFinal: x.isFinal, label: x.label})
			x.transitions.map(t => {
				edges.push({from: t.from, to: t.to, label: t.label})
			})
		})
		return {nodes: nodes, edges: edges}
	}

	toExampleLinesFather(valiableName,constructorName){
		console.log('const '+valiableName+' = new '+constructorName+'('+"'generated',"+JSON.stringify(Array.from(this.alphabet))+')')

		let dataset = this.toData()
		for(let state of dataset.nodes)
			console.log(valiableName+'.addState('+"'"+state.label+"',"+state.isInitial+','+state.isFinal+')')
		for(let trans of dataset.edges)
			console.log(valiableName+'.addTransition('+"'"+trans.label+"',"+"'"+trans.from+"'"+','+"'"+trans.to+"'"+')')
	}
}

export class State {
	transitions = []
	constructor(label = "new State", isInitial = false, isFinal = false){
		this.label = label
		this.isInitial = isInitial
		this.isFinal = isFinal
	}

	addTransition(transition){
		this.transitions.push(transition)
	}

	setInitial(isInitial = true){
		this.isInitial = isInitial
	}

	setFinal(isFinal = true){
		this.isFinal = isFinal
	}

	hasTransition(symbol){
		return this.transitions.filter(t => t.match(symbol)).length>0
	}
}

export class Transition {
	constructor(label = "new Transition", from = "from", to = "to"){
		this.label = label
		this.from = from
		this.to = to
	}

	match(a) {
		let setOfa = a.split(/,|\//)
		for(let e of this.label.split(/,|\//))
		{
			for(let c of setOfa)
			{
				if (c == e) return true
			}
		}
		return false
	}

	ableToPop(symbol,popvalue){
		let values = this.label.split('/')
		let leftValue = values[0].split(',')
		let rightValue = values[1].split(',')
		return leftValue[0] ==  symbol && leftValue[1] == popvalue
	}
}

function getStateColor(state) {
	let colorGreen = '00'
	let colorRed = '00'
	if (state.isInitial)
		colorGreen = 'ff'
	if (state.isFinal)
		colorRed = 'ff'
	let color = "#" + colorRed + colorGreen + "00"
	return (color=="#000000")?undefined:color
}