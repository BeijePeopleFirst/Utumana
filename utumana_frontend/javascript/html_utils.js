function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function setElementValueFromStorage(elementId, storageKey = elementId){
	let item = sessionStorage.getItem(storageKey);
	if(item != null){
		document.getElementById(elementId).value = item;
	}
}

function setElementInnerHTMLFromStorage(elementId, storageKey = elementId){
	let item = sessionStorage.getItem(storageKey);
	if(item != null){
		document.getElementById(elementId).innerHTML = item;
	}
}

function setTodayAsDateMin(elementId){
	let today = new Date().toISOString().slice(0, 10);
	document.getElementById(elementId).setAttribute("min", today);
		
}

function setTomorrowAsDateMin(elementId){
	let tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow = tomorrow.toISOString().slice(0, 10);
	document.getElementById(elementId).setAttribute("min", tomorrow);
}