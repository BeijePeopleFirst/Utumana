
function loadHomePage(){
	// load header
	initHeader();
	
	// load default check-in, check-out
	let today = new Date().toISOString().slice(0, 10);
	let tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow = tomorrow.toISOString().slice(0, 10);
	
	document.getElementById("check-in").setAttribute("min", today);
	document.getElementById("check-out").setAttribute("min", tomorrow);
	
	// load search fields if present
	displaySearchParams(sessionStorage.getItem("destination"), sessionStorage.getItem("check-in"), sessionStorage.getItem("check-out"), 
						sessionStorage.getItem("number_of_guests"), sessionStorage.getItem("free_only"));
	
	// load latest accommodations
	doFetch(prefixUrl + 'api/get_latest_uploads', 'GET', headers, null)
		.then((json) => {
			console.log(json);
									
			const container = document.getElementById("latest_accommodations");
			displayAccommodationsCards(container, json, "No accommodations yet");
			
			displayPrices(json);
		})
		.catch((error) => {
			console.log(error, "Error trying to get latest accommodations");
		});
}

function setCheckOutMin(){
	let dayAfterCheckIn = new Date(document.getElementById("check-in").value);
	dayAfterCheckIn.setDate(dayAfterCheckIn.getDate() + 1);
	dayAfterCheckIn = dayAfterCheckIn.toISOString().slice(0, 10);
	
	document.getElementById("check-out").setAttribute("min", dayAfterCheckIn);
}

function areSearchParamsOK(checkIn, checkOut, guests, freeOnly, writeErrors){
	const error = document.getElementById("error");
	error.innerHTML = '';
	let ok = true;
	
	if(checkIn == null){
		ok = false;
		if(writeErrors == true)	error.innerHTML += "Please indicate a check-in date. "
	}
	if(checkOut == null){
		ok = false;
		if(writeErrors == true)	error.innerHTML += "Please indicate a check-out date. "
	}
	if(new Date(checkIn) == "Invalid Date" || new Date(checkOut) == "Invalid Date"){
		ok = false;
		if(writeErrors == true)	error.innerHTML += "Invalid dates. "
	} else if(new Date(checkIn) >= new Date(checkOut)){
		ok = false;
		if(writeErrors == true) error.innerHTML += "Check-in must be before check-out. ";
	}
	
	if(isNaN(parseInt(guests)) || parseInt(guests) <= 0){
		ok = false;
		if(writeErrors == true) error.innerHTML += "The number of guests must be 1 or more. ";
	}
	
	if(freeOnly == null){
		ok = false;
		if(writeErrors == true) error.innerHTML += "Could not get checkbox value. Please retry. ";
	}
	
	return ok;
}

function displaySearchParams(dest, checkIn, checkOut, guests, freeOnly){
	if(!dest || dest == "null")
		document.getElementById("destination").value = '';
	else
		document.getElementById("destination").value = dest;
	
	document.getElementById("check-in").value = checkIn;
	document.getElementById("check-out").value = checkOut;
	
	if(!guests) guests = 1;
	document.getElementById("number_of_guests").value = guests;
	
	if(freeOnly == "true" || freeOnly == true)
		document.getElementById("free_only").checked = true;
	else
		document.getElementById("free_only").checked = false;
}

function searchFromHomePage(){
	//const dest = encodeURIComponent(document.getElementById("destination").value);
	const dest = document.getElementById("destination").value;
	const checkIn = document.getElementById("check-in").value;
	const checkOut = document.getElementById("check-out").value;
	const guests = document.getElementById("number_of_guests").value;
	const freeOnly = document.getElementById("free_only").checked;

	if(!areSearchParamsOK(checkIn, checkOut, guests, freeOnly, true))
		return;
	
	// save params in storage
	sessionStorage.setItem("destination", dest);
	sessionStorage.setItem("check-in", checkIn);
	sessionStorage.setItem("check-out", checkOut);
	sessionStorage.setItem("number_of_guests", guests);
	sessionStorage.setItem("free_only", freeOnly);
	
	// get search results accommodations page
	window.location.href = staticUrl +'search_results_accommodations.html';
	/*
	window.location.href = staticUrl + 'search_results_accommodations.html?destination=' + dest + 
						"&check-in=" + checkIn + "&check-out=" + checkOut + 
						"&number_of_guests=" + guests + "&free_only=" + freeOnly; */
}

function loadSearchResultsPage(){
	// load header
	initHeader();
	
	/*
	// get params from URL
	let params = new URL(document.location.toString()).searchParams;
	const dest = decodeURIComponent(params.get("destination"));
	const checkIn = params.get("check-in"); 
	const checkOut = params.get("check-out");
	const guests = params.get("number_of_guests");
	const freeOnly = params.get("free_only"); */
	
	// get params from storage
	const dest = sessionStorage.getItem("destination");
	const checkIn = sessionStorage.getItem("check-in");
	const checkOut = sessionStorage.getItem("check-out");
	const guests = sessionStorage.getItem("number_of_guests");
	const freeOnly = sessionStorage.getItem("free_only");
	
	let item = sessionStorage.getItem("filters");
	let serviceIds = [];
	if(item != null)
		serviceIds = JSON.parse(item);
	
	displaySearchParams(dest, checkIn, checkOut, guests, freeOnly);
	
	// load search filters	
	doFetch(prefixUrl + 'api/services', 'GET', headers, null)
		.then((json) => {
			console.log(json);
			
			const filtersContainer = document.getElementById("filters");
			let filterDiv, element;
			for(let i=0; i<json.length; i++) {
				filterDiv = document.createElement("div");
				filterDiv.className = "filter";
				
				element = document.createElement("input");
				element.setAttribute("type", "checkbox");
				element.setAttribute("id", "service" + json[i].id);
				element.setAttribute("value", json[i].id);
				element.setAttribute("onclick", "applyFilter(this)")
				if(serviceIds.includes(json[i].id))
					element.setAttribute("checked", "true");
				filterDiv.appendChild(element);
				
				element = document.createElement("img");
				element.setAttribute("src", json[i].icon_url);
				element.setAttribute("alt", "service_icon")
				element.setAttribute("id", "icon" + json[i].id);
				filterDiv.appendChild(element);
				
				element = document.createElement("label");
				element.setAttribute("for", "icon" + json[i].id);
				element.innerHTML = json[i].title;
				filterDiv.appendChild(element);
				
				filtersContainer.appendChild(filterDiv);
			}
		})
		.catch((error) => {
			console.log(error, "Error trying to get all services");
		});
	
	// set order and onchange
	const orderSelect = document.getElementById("orders");
	item = sessionStorage.getItem("order_value");
	if(item != null){
		orderSelect.value = item;
	}else {
		orderSelect.value = "timestamp";
	}
	orderSelect.setAttribute("onchange", "changeOrder(this.value)");
	
	const ascDescSelect = document.getElementById("ascdesc");
	item = sessionStorage.getItem("order_direction");
	if(item != null){
		ascDescSelect.value = item;
	}else {
		ascDescSelect.value = "desc";
	}
	ascDescSelect.setAttribute("onchange", "changeOrder(this.value)");
	
	// check params
	if(!areSearchParamsOK(checkIn, checkOut, guests, freeOnly, false)){
		document.getElementById("loader").remove();
		return;
	}
	
	// do search and load search results
	searchAndDisplay();
}

function searchAndDisplay(){
	const accommodationsContainer = document.getElementById("accommodations");
	
	// delete old results and display loader
	let loader = document.createElement("div");
	loader.className = "loader";
	accommodationsContainer.innerHTML = '';
	accommodationsContainer.appendChild(loader);
	
	const dest = encodeURIComponent(document.getElementById("destination").value);
	const checkIn = document.getElementById("check-in").value;
	const checkOut = document.getElementById("check-out").value;
	const guests = document.getElementById("number_of_guests").value;
	const freeOnly = document.getElementById("free_only").checked;
	
	// check params
	if(!areSearchParamsOK(checkIn, checkOut, guests, freeOnly, true)){
		document.getElementById("loader").remove();
		return;
	}
	
	// build orderBy param
	const orderValue = document.getElementById("orders").value;
	const orderDirection = document.getElementById("ascdesc").value;
	let orderBy = '';
	if(orderValue == "timestamp"){
		orderBy = "approvalTimestamp";
	} else if(orderValue == "price"){
		orderBy = "minPrice";
	} else if(orderValue == "city" || orderValue == "title"){
		orderBy = orderValue;
	} else {
		console.log("Error: unknown order by value");
		return;
	}
	orderBy += "-" + orderDirection;
	
	// save in storage
	sessionStorage.setItem("destination", dest);
	sessionStorage.setItem("check-in", checkIn);
	sessionStorage.setItem("check-out", checkOut);
	sessionStorage.setItem("number_of_guests", guests);
	sessionStorage.setItem("free_only", freeOnly);
	sessionStorage.setItem("order_value", orderValue);
	sessionStorage.setItem("order_direction", orderDirection);
	
	const item = sessionStorage.getItem("filters");
	let serviceIds = [];
	if(item != null)
		serviceIds = JSON.parse(item);
	
	// search
	let searchUrl = 'api/search?destination=' + dest + 
						"&check-in=" + checkIn + "&check-out=" + checkOut + 
						"&number_of_guests=" + guests + "&free_only=" + freeOnly + 
						"&services=" + serviceIds + "&order_by=" + orderBy;
	
	doFetch(prefixUrl + searchUrl, 'GET', headers, null)
		.then((json) => {
			console.log(json);
							
			displayAccommodationsCards(accommodationsContainer, json, "No accommodations found");
		})
		.catch((error) => {
			console.log(error, "Error trying to search accommodations");
		});
}

function applyFilter(checkboxElement) {
	const item = sessionStorage.getItem("filters");
	let serviceIds = [];
	if(item != null)
		serviceIds = JSON.parse(item);
	
	if(checkboxElement.checked == true){
		// apply filter
		serviceIds.push(parseInt(checkboxElement.value));
	} else {
		// remove filter
		const index = serviceIds.indexOf(parseInt(checkboxElement.value));
		if(index > -1){
			serviceIds.splice(index, 1);
		}
	}
	
	sessionStorage.setItem("filters", JSON.stringify(serviceIds));
	
	searchAndDisplay();
}

function changeOrder(value){
	const validValues = ["timestamp","price","city","title","asc","desc"];
	if(validValues.includes(value)){
		searchAndDisplay();
	} else {
		console.log("Unknown selected order : ", value);
	}
}
