function getSelectorsDfa0(){return document.getElementById('selecter-dfa0').children}
function getSelectorsDfa1(){return document.getElementById('selecter-dfa1').children}
function getOperation(){return document.getElementById('dfa-operation-title').innerHTML}
function hideModals(node){
	let parents = document.getElementsByClassName(node.getAttribute('data-dismiss'))
	for(let parent of parents){
		parent.style.display = 'none'
	}
}

function updateSelectors(id){
	let selector = document.getElementById(id)
	selector.innerHTML = ''
	let index = 0
	for(let automaton of dfa_automatons){
		let spanItem = document.createElement('span')
		spanItem.className = 'selecter-item'
		spanItem.setAttribute("data-value",index)
		spanItem.innerHTML = automaton.name
		selector.appendChild(spanItem)
		index++
	}
}

var cancelButton =  document.getElementsByClassName("modal-cancel")
for(let b of cancelButton){
	b.addEventListener("click", () => {
		hideModals(b)
	})
}

var invoks = document.getElementsByClassName('model-invok')
for(let invok of invoks){
	let idModal = invok.getAttribute("href")
	let modal = document.getElementById(idModal.substring(1,idModal.length))
	let title = invok.innerHTML
	let selecterDFA1 = document.getElementById('selecter-dfa1')
	invok.addEventListener("click", () => {
		updateSelectors('selecter-dfa0')
		updateSelectors('selecter-dfa1')
		setListenerForSelectAutomaton(getSelectorsDfa0())
		setListenerForSelectAutomaton(getSelectorsDfa1())
		document.getElementById('dfa-operation-title').innerHTML = title
		if (title=='Complement') {
			selecterDFA1.style.display = 'none'
		}else{
			selecterDFA1.style.display = 'block'
		}
		modal.style.display = 'block'
	})
}

function setListenerForSelectAutomaton (selectedItems) {
	for(let item of selectedItems){
		let data_value = item.getAttribute('data-value')
		item.addEventListener("click", () => {
			for(let s of selectedItems){
				s.className = 'selecter-item'
				if (s.getAttribute('data-value')==data_value) s.className += ' selected'
			}
		})
	}
}

var generators = document.getElementsByClassName('generate-operation')
for(let gen of generators){
	gen.addEventListener("click",() => {
		let selected_0 = getSelectorsDfa0()
		for(let s of selected_0){
			if (s.className.indexOf('selected')!=-1) {
				selected_0 = s.getAttribute('data-value')
			}
		}
		let selected_1 = getSelectorsDfa1()
		for(let s of selected_1){
			if (s.className.indexOf('selected')!=-1) {
				selected_1 = s.getAttribute('data-value')
			}
		}
		let processed = processOperation(getOperation(),selected_0,selected_1)
		setAutomaton(processed)
		hideModals(gen)
	})
}

function processOperation(operation,index0,index1){
	let dfa0 = dfa_automatons[index0]
	let dfa1 = dfa_automatons[index1]
	dfa0 = AutomatonJS.NewDFA(dfa0.dataset,dfa0.name,dfa0.alphabet)
	dfa1 = (operation!='Complement')?AutomatonJS.NewDFA(dfa1.dataset,dfa1.name,dfa1.alphabet):null

	let processed = undefined
	if (operation=='Complement') {
		processed = AutomatonJS.complementAutomaton(dfa0)
	}else if (operation=='Union'){
		processed = AutomatonJS.unionAutomaton(dfa0,dfa1)
	}else if (operation=='Intersection'){
		processed = AutomatonJS.intersectionAutomaton(dfa0,dfa1)
	}else if (operation=='Difference'){
		processed = AutomatonJS.differenceAutomaton(dfa0,dfa1)
	}
	return processed
}