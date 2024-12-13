// dependent on post.js, html_utils.js

function postRecapOnLoad(){
	loadInfo();
	loadServices();
	loadAddress();
	loadAvailabilities();
}

function loadInfo(){
	setElementValueFromStorage("title");
	
	let item = sessionStorage.getItem("description");
	const descriptionElement = document.getElementById("description");
	descriptionElement.value = item;
	descriptionElement.style.height = descriptionElement.scrollHeight + "px";
	descriptionElement.style.overflow = "hidden";
	
	setElementValueFromStorage("beds");
	setElementValueFromStorage("rooms");
	
	// images TODO
}

function loadServices(){
	let selected = getArrayFromStorage("services");
	if(selected != null && selected.length > 0){
		doFetch(prefixUrl + 'api/services?ids=' + selected, 'GET', headers, null)
		.then((json) => {
			console.log(json);
			displayServices(document.getElementById("recap_services"), json, "No services");
		})
		.catch((error) => {
			console.log(error, "Error trying to load selected services");
		});
	}
}

function loadAddress(){
	setElementValueFromStorage("country");
	setElementValueFromStorage("cap");
	setElementValueFromStorage("street");
	setElementValueFromStorage("str_num");
	setElementValueFromStorage("info");
	setElementValueFromStorage("province");
	setElementValueFromStorage("city");	
}

function loadAvailabilities(){
	// load availabilities from session storage
	const availabilities = getArrayFromStorage("availabilities");
	let table = document.getElementById("availabilities");
	if(availabilities != null && availabilities.length > 0){
		for(let i=0; i<availabilities.length; i++){
			appendAvailability(table, availabilities[i]);	
		}
	} else {
		//<tr id="default-av"><td colspan=3> No availabilities yet</td></tr>
		appendDefaultRow(table, "default-av", 4, "No availabilities yet");
	}
	
	// load unavailabilities from session storage
	const unavailabilities = getArrayFromStorage("unavailabilities");
	table = document.getElementById("unavailabilities");
	if(unavailabilities != null && unavailabilities.length > 0){
		for(let i=0; i<unavailabilities.length; i++){
			appendUnavailability(table, unavailabilities[i]);	
		}
	} else {
		//<tr id="default-un"><td colspan=2> No unavailabilities yet</td></tr>
		appendDefaultRow(table, "default-un", 3, "No unavailabilities yet");
	}
}

function displayServices(container, json, noServicesMessage){
	container.innerHTML = '';
	
	let element;
	if(!json || json.length == 0){
		element = document.createElement("p");
		element.innerHTML = noServicesMessage;
		container.appendChild(element);
		return;
	}
	
	let div, id;
	for(let i=0; i<json.length; i++){
		id = json[i].id;
		
		div = document.createElement("div");
		div.setAttribute("id", id)
		
		element = document.createElement("img");
		element.setAttribute("src", json[i].icon_url);
		element.setAttribute("alt", "service_icon")
		element.setAttribute("id", "icon" + json[i].id);
		div.appendChild(element);
		
		element = document.createElement("label");
		element.setAttribute("for", "icon" + json[i].id);
		element.innerHTML = json[i].title;
		div.appendChild(element);
		
		container.appendChild(div);
	}
}

function appendAvailability(table, availability){
	let tr, td;
				
	tr = document.createElement("tr");
	tr.setAttribute("id",availability.id);
	
	td = document.createElement("td");
	td.innerHTML = availability.start_date;
	tr.appendChild(td);
	
	td = document.createElement("td");
	td.innerHTML = availability.end_date;
	tr.appendChild(td);
	
	td = document.createElement("td");
	td.innerHTML = availability.price_per_night;
	tr.appendChild(td);
	
	table.appendChild(tr);
}

function appendUnavailability(table, unavailability){
	let tr, td;
			
	tr = document.createElement("tr");
	tr.setAttribute("id", unavailability.id);
	
	td = document.createElement("td");
	td.innerHTML = unavailability.check_in;
	tr.appendChild(td);
	
	td = document.createElement("td");
	td.innerHTML = unavailability.check_out;
	tr.appendChild(td);
	
	table.appendChild(tr);
}

function confirmAccommodationPost(){
	let accommodation = {
		owner_id: 	parseInt(localStorage.getItem("id")),
		title: 		sessionStorage.getItem("title"),
		beds: 		parseInt(sessionStorage.getItem("beds")),
		rooms: 		parseInt(sessionStorage.getItem("rooms")),
		country:	sessionStorage.getItem("country"),
		cap:		sessionStorage.getItem("cap"),
		main_photo_url: "static/images/house1.jpg",	// TODO PUT REAL URL when implementing photos upload
		//approval_timestamp: "2024-12-09",
		//hiding_timestamp: "2024-12-09"
	}
	
	// add optional fields to accommodation if not empty
	let item = sessionStorage.getItem("description");
	if(item)
		accommodation.description = item;
	
	item = sessionStorage.getItem("street");
	if(item)
		accommodation.street = item;
	
	item = sessionStorage.getItem("str_num");
	if(item)
		accommodation.street_number = item;
	
	item = sessionStorage.getItem("city");
	if(item)
		accommodation.city = item;
	
	item = sessionStorage.getItem("province");
	if(item)
		accommodation.province = item;
	
	item = sessionStorage.getItem("info");
	if(item)
		accommodation.address_notes = item;
	
	console.log("Accommodation: ", accommodation)
	
	let fetchRejected = false;
	// create accommodation
	doFetch(prefixUrl + 'api/accommodation', 'POST', headers, JSON.stringify(accommodation))
	.then((json) => {
		console.log("Created accommodation", json);
		
		// set accommodation's services
		const serviceIds = getArrayFromStorage("services");
		doFetch(prefixUrl + 'api/accommodation/' + json.id + '/services', 'PATCH', headers, JSON.stringify(serviceIds))
		.then((json) => {
			console.log("Added services: ", json);
			
			// set accommodation's availabilities
			let availabilities = getArrayFromStorage("availabilities");
			// remove fake ids from availabilities and put accommodation_id
			for(let av of availabilities){
				delete av.id
				av.accommodation_id = json.id
			}
			
			doFetch(prefixUrl + 'api/accommodation/' + json.id + '/availabilities', 'PATCH', headers, JSON.stringify(availabilities))
			.then((json) => {
				console.log("Added availabilities: ",json);
				
				// set accommodation's unavailabilities
				let unavailabilities = getArrayFromStorage("unavailabilities");
				// remove fake ids from unavailabilities
				for(let unav of unavailabilities){
					delete unav.id
				}
				
				doFetch(prefixUrl + 'api/accommodation/' + json.id + '/unavailabilities', 'PATCH', headers, JSON.stringify(unavailabilities))
				.then((json) => {
					console.log("Added unavailabilities: ",json);
					
					// set accommodation's photos
					// TODO
					
					initHeader();
					
					document.getElementById("progress_bar").style.marginTop = "20px";
					document.getElementById("colored-bar").innerHTML = "done &#x1F389;";
					
					const container = document.getElementById("recap");
					container.innerHTML = '';
					container.style.margin = "10px";
					
					let div = document.createElement("div");
					div.style.textAlign = "center";
					div.innerHTML = "Accommodation submitted successfully. Waiting for approval or feedback from the admins."
					container.appendChild(div);
					
					// remove info from storage
					removeAccommodationFromStorage();
				})
				.catch((error) => {
					console.log(error, "Error trying to set accommodation's unavailabilities");
					fetchRejected = true;
				})
				
			})
			.catch((error) => {
				console.log(error, "Error trying to set accommodation's availabilities");
				fetchRejected = true;
			})
		})
		.catch((error) => {
			console.log(error, "Error trying to set accommodation's services");
			fetchRejected = true;
		})
	})
	.catch((error) => {
		console.log(error, "Error trying to create accommodation");	
		fetchRejected = true;
	});
	
	if(fetchRejected == true){
		// "roll back" and delete accommodation if created with partial info ???
		
		// display error
		document.getElementById("colored-bar").innerHTML = "error :(";
		document.getElementById("colored-bar").style.color = "rgb(139,0,0)";
		
		let errorMessage = document.getElementById("error");
		errorMessage.innerHTML = "Error with the accommodation's submission. Please check your accommodation data and retry.";
		errorMessage.style.visibility = "visible";
	}
}