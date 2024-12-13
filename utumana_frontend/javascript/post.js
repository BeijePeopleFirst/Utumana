// depends on utils.js

function removeAccommodationFromStorage(){
	// info
		sessionStorage.removeItem("title");
		sessionStorage.removeItem("description");
		sessionStorage.removeItem("beds");
		sessionStorage.removeItem("rooms");
		sessionStorage.removeItem("images");
		// services
		sessionStorage.removeItem("services");
		// address
		sessionStorage.removeItem("country");
		sessionStorage.removeItem("cap");
		sessionStorage.removeItem("street");
		sessionStorage.removeItem("str_num");
		sessionStorage.removeItem("city");
		sessionStorage.removeItem("province");
		sessionStorage.removeItem("info");
		// availabilities
		sessionStorage.removeItem("availabilities");
		sessionStorage.removeItem("unavailabilities");
}
function cancelAccommodationPost(){
	removeAccommodationFromStorage();
	window.location.href = staticUrl + 'home.html';
}

function getIdFromURL(){
	let params = new URL(document.location.toString()).searchParams;
	let accommodationId = params.get("id");
	if(accommodationId != null && /^\d+$/.test(accommodationId) == false) // if it's not a number
		accommodationId = null;
	return accommodationId;
}

function getArrayFromStorage(key){
	let item = sessionStorage.getItem(key);
	let array = [];
	if(item != null)
		array = JSON.parse(item);
	return array;
}

function appendDefaultRow(table, rowId, colspanValue, message){
	let tr = document.createElement("tr");
	tr.setAttribute("id",rowId);
	
	let td = document.createElement("td");
	td.setAttribute("colspan", colspanValue);
	td.innerHTML = message;
	tr.appendChild(td);
	
	table.appendChild(tr);
}

function showError(containerId, message){
	// show error to user
	const container = document.getElementById(containerId);
	container.innerHTML = '';
	container.style.margin = "50px";
	
	let h2 = document.createElement("h2");
	h2.innerHTML = "Error :(";
	container.appendChild(h2);
	
	let div = document.createElement("div");
	div.style.textAlign = "center";
	div.innerHTML = message;
	container.appendChild(div);
}

function showSuccess(containerId, message){
	const container = document.getElementById(containerId);
	container.innerHTML = '';
	container.style.margin = "50px";
	
	let h2 = document.createElement("h2");
	h2.innerHTML = "Success!";
	container.appendChild(h2);
	
	let div = document.createElement("div");
	div.style.textAlign = "center";
	div.innerHTML = message;
	container.appendChild(div);
}