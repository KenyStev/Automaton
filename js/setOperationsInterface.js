function getSelectorsDfa0(){return document.getElementById('selecter-dfa0').children}
function getSelectorsDfa1(){return document.getElementById('selecter-dfa1').children}

var cancelButton =  document.getElementsByClassName("modal-cancel")
for(let b of cancelButton){
	b.addEventListener("click", () => {
		let parents = document.getElementsByClassName(b.getAttribute('data-dismiss'))
		for(let parent of parents){
			parent.style.display = 'none'
		}
	})
}

var invoks = document.getElementsByClassName('model-invok')
for(let invok of invoks){
	let idModal = invok.getAttribute("href")
	let modal = document.getElementById(idModal.substring(1,idModal.length))
	invok.addEventListener("click", () => {
		console.log(idModal)
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
			
			console.log("data_value")
			console.log(data_value)
		})
	}
}
setListenerForSelectAutomaton(getSelectorsDfa0())
setListenerForSelectAutomaton(getSelectorsDfa1())

// var generators = document.getElementsByClassName('generate-operation')
// for(let gen of generators){
// 	let selected_0 = getSelectorsDfa0()
// 	for(let s of selected_0){
// 		if (s.className.) {

// 		}
// 	}

// 	gen.addEventListener("click",() => {
// 		console.log(selected_0)
// 		console.log(dfa_automatons[selected_0])
// 		console.log(selected_1)
// 		console.log(dfa_automatons[selected_1])
// 	})
// }