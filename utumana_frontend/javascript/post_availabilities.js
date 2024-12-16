// depends on post.js, html_utils.js, utils.js

var avLocalId = 0;
var unavLocalId = 0;

async function loadWhenEditing(){
	const accommodationId = getIdFromURL(); 
	if(accommodationId != null){
		initHeader();
		document.getElementById("progress_bar").style.display = "none";
		document.getElementById("save_button").innerHTML = "Save changes";
		
		// fetch accommodation's availabilities and put them in sessionStorage
		await doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/availabilities', 'GET', headers, null)
		.then((json) => {
			console.log(json);
			
			if(json.status != null){
				showError("container","Could not load the accommodation's availabilities. Please retry.");
			} else {
				sessionStorage.setItem("availabilities", JSON.stringify(json));
			}
		})
		.catch((error) => {
			console.log(error, "Error trying to load accommodation's availabilities");
			showError("container","Could not load the accommodation's availabilities. Please retry.");
		});
		
		// fetch accommodation's unavailabilities and put them in sessionStorage
		await doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/unavailabilities', 'GET', headers, null)
		.then((json) => {
			console.log(json);
			
			if(json.status != null){
				showError("container","Could not load the accommodation's unavailabilities. Please retry.");
			} else {
				sessionStorage.setItem("unavailabilities", JSON.stringify(json));
			}
		})
		.catch((error) => {
			console.log(error, "Error trying to load accommodation's unavailabilities");
			showError("container","Could not load the accommodation's unavailabilities. Please retry.");
		});
	}
}

async function postAvailabilitiesOnLoad(){
	await loadWhenEditing();
	
	avLocalId = 0;
	unavLocalId = 0;
	displayPeriods();
	
	resetValidities();
	
	setTodayAsDateMin("av_start_date");
	setTomorrowAsDateMin("av_end_date");
	setTodayAsDateMin("unav_start_date");
	setTomorrowAsDateMin("unav_end_date");
}

function appendAvailability(table, availability){
	let tr, td, button, id;

	if(availability.id != null){
		id = availability.id;
		if(id instanceof String && id.indexOf("av") != -1)
			avLocalId++;
	} else {
		id = "av-" + avLocalId;
		avLocalId++;
	}
				
	tr = document.createElement("tr");
	tr.setAttribute("id",id);
	
	td = document.createElement("td");
	td.innerHTML = availability.start_date;
	tr.appendChild(td);
	
	td = document.createElement("td");
	td.innerHTML = availability.end_date;
	tr.appendChild(td);
	
	td = document.createElement("td");
	td.innerHTML = availability.price_per_night;
	tr.appendChild(td);
	
	td = document.createElement("td");
	button = document.createElement("button");
	button.setAttribute("type", "submit");
	button.innerHTML = "Delete";
	button.setAttribute("onclick", "deleteAvailability('" + id + "')");
	td.appendChild(button);
	tr.appendChild(td);
	
	table.appendChild(tr);
	
	return id;
}

function appendUnavailability(table, unavailability){
	let tr, td, button, id;

	if(unavailability.id != null){
		id = unavailability.id;
		if(id instanceof String && id.indexOf("un") != -1)
			unavLocalId++;
	} else {
		id = "un-" + unavLocalId;
		unavLocalId++;
	}
				
	tr = document.createElement("tr");
	tr.setAttribute("id",id);
	
	td = document.createElement("td");
	td.innerHTML = unavailability.check_in;
	tr.appendChild(td);
	
	td = document.createElement("td");
	td.innerHTML = unavailability.check_out;
	tr.appendChild(td);
	
	td = document.createElement("td");
	button = document.createElement("button");
	button.setAttribute("type", "submit");
	button.innerHTML = "Delete";
	button.setAttribute("onclick", "deleteUnavailability('" + id + "')");
	td.appendChild(button);
	tr.appendChild(td);
	
	table.appendChild(tr);
	
	return id;
}

function displayPeriods(){
	// load availabilities from session storage
	const availabilities = getArrayFromStorage("availabilities");
	let table = document.getElementById("availabilities");
	if(availabilities != null && availabilities.length > 0){
		const defaultAv = document.getElementById("default-av");
		if(defaultAv != null)	defaultAv.remove();
		
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
		const defaultUn = document.getElementById("default-un");
		if(defaultUn != null)	defaultUn.remove();
		
		for(let i=0; i<unavailabilities.length; i++){
			appendUnavailability(table, unavailabilities[i]);	
		}
	} else {
		//<tr id="default-un"><td colspan=2> No unavailabilities yet</td></tr>
		appendDefaultRow(table, "default-un", 3, "No unavailabilities yet");
	}
}

function addAvailability(){
	const startDateElement = document.getElementById("av_start_date");
	const endDateElement = document.getElementById("av_end_date");
	const price = document.getElementById("price");
	let priceValue = price.value;
	priceValue = priceValue.replace(',','.');
	const table = document.getElementById("availabilities");
	
	let availability = {
		start_date: startDateElement.value, 
		end_date: endDateElement.value,
		price_per_night: priceValue
	}
	
	resetAvValidities();
	// check availability
	if(!availabilityOK(availability))
		return;
	availability.price_per_night = parseFloat(priceValue);
	
	// display it in table
	const defaultAv = document.getElementById("default-av");
	if(defaultAv != null){
		defaultAv.remove();
	}
	const id = appendAvailability(table, availability);
	availability.id = id;
	
	// update availabilities in storage
	let availabilities = getArrayFromStorage("availabilities");
	availabilities.push(availability);
	sessionStorage.setItem("availabilities", JSON.stringify(availabilities));
	
	startDateElement.value = '';
	endDateElement.value = '';
	price.value = 0;
}

function addUnavailability(){
	const startDateElement = document.getElementById("unav_start_date");
	const endDateElement = document.getElementById("unav_end_date");
	const table = document.getElementById("unavailabilities");

	let unavailability = { // 'fake' booking: must add userId, accommodationId, is_unavailability = true and status = 'ACCEPTED' in backend before saving in db
		check_in: startDateElement.value, 
		check_out: endDateElement.value
	}
	
	resetUnavValidities();
	// check unavailability
	if(!unavailabilityOK(unavailability))
		return;
	
	// display it in table
	const defaultUn = document.getElementById("default-un");
	if(defaultUn != null)	defaultUn.remove();
	const id = appendUnavailability(table, unavailability);
	unavailability.id = id;
	
	// update unavailabilities in storage
	let unavailabilities = getArrayFromStorage("unavailabilities");
	unavailabilities.push(unavailability);
	sessionStorage.setItem("unavailabilities", JSON.stringify(unavailabilities));
	
	startDateElement.value = '';
	endDateElement.value = '';
}

function resetValidities(){
	resetAvValidities();
	resetUnavValidities();
}
function resetAvValidities(){
	resetAvStartDateValidity();
	resetAvEndDateValidity();
	resetAvPriceValidity();
}
function resetAvStartDateValidity(){
	document.getElementById("av_start_date").ariaInvalid = "false";
	document.getElementById("av_start_date_error").style.visibility = "hidden";
	
	let datesError = document.getElementById("av_dates_error");
	if(datesError.style.visibility == "visible"){
		document.getElementById("av_end_date").ariaInvalid = "false";
		datesError.style.visibility = "hidden";
	}
}
function resetAvEndDateValidity(){
	document.getElementById("av_end_date").ariaInvalid = "false";
	document.getElementById("av_end_date_error").style.visibility = "hidden";
	
	let datesError = document.getElementById("av_dates_error");
	if(datesError.style.visibility == "visible"){
		document.getElementById("av_start_date").ariaInvalid = "false";
		datesError.style.visibility = "hidden";
	}
}
function resetAvPriceValidity(){
	document.getElementById("price").ariaInvalid = "false";
	document.getElementById("price_error").style.visibility = "hidden";
}

function resetUnavValidities(){
	resetUnavStartDateValidity();
	resetUnavEndDateValidity();
}
function resetUnavStartDateValidity(){
	document.getElementById("unav_start_date").ariaInvalid = "false";
	document.getElementById("unav_start_date_error").style.visibility = "hidden";
	
	let datesError = document.getElementById("unav_dates_error");
	if(datesError.style.visibility == "visible"){
		document.getElementById("unav_end_date").ariaInvalid = "false";
		datesError.style.visibility = "hidden";
	}
}
function resetUnavEndDateValidity(){
	document.getElementById("unav_end_date").ariaInvalid = "false";
	document.getElementById("unav_end_date_error").style.visibility = "hidden";
	
	let datesError = document.getElementById("unav_dates_error");
	if(datesError.style.visibility == "visible"){
		document.getElementById("unav_start_date").ariaInvalid = "false";
		datesError.style.visibility = "hidden";
	}
}

function availabilityOK(availability){
	let ok = true;
	if(!availability.start_date){
		ok = false;
		document.getElementById("av_start_date").ariaInvalid = "true";
		document.getElementById("av_start_date_error").style.visibility = "visible";
	}
	if(!availability.end_date){
		ok = false;
		document.getElementById("av_end_date").ariaInvalid = "true";
		document.getElementById("av_end_date_error").style.visibility = "visible";
	}
	let startDate = new Date(availability.start_date);
	let endDate = new Date(availability.end_date);
	if(startDate >= endDate){
		ok = false;
		document.getElementById("av_start_date").ariaInvalid = "true";
		document.getElementById("av_end_date").ariaInvalid = "true";
		document.getElementById("av_dates_error").innerHTML = "The start date must be before the end date"
		document.getElementById("av_dates_error").style.visibility = "visible";
	}
	if(availability.price_per_night == null || /^\d+(\.\d{1,2})?$/.test(availability.price_per_night) == false){
		ok = false;
		document.getElementById("price").ariaInvalid = "true";
		document.getElementById("price_error").style.visibility = "visible";
	}
	if(ok == false){
		return false;
	}
	
	ok = isNotOverlappingAvailability(availability);
	if(ok == false){
		document.getElementById("av_start_date").ariaInvalid = "true";
		document.getElementById("av_end_date").ariaInvalid = "true";
		document.getElementById("av_dates_error").innerHTML = "The availability periods cannot overlap";
		document.getElementById("av_dates_error").style.visibility = "visible";
	}
	return ok;
}
function isNotOverlappingAvailability(availability){
	const availabilities = getArrayFromStorage("availabilities");
	const start = availability.start_date;
	const end = availability.end_date;
	for(let i=0; i<availabilities.length; i++){
		if(availabilities[i].start_date <= start && start < availabilities[i].end_date){
			return false;
		} else if(availabilities[i].start_date < end && end <= availabilities[i].end_date){
			return false;
		} else if(start <= availabilities[i].start_date && availabilities[i].end_date <= end){
			return false;
		}
	}
	return true;
}

function unavailabilityOK(unavailability){
	let ok = true;
	if(!unavailability.check_in){
		ok = false;
		document.getElementById("unav_start_date").ariaInvalid = "true";
		document.getElementById("unav_start_date_error").style.visibility = "visible";
	}
	if(!unavailability.check_out){
		ok = false;
		document.getElementById("unav_end_date").ariaInvalid = "true";
		document.getElementById("unav_end_date_error").style.visibility = "visible";
	}
	let startDate = new Date(unavailability.check_in);
	let endDate = new Date(unavailability.check_out);
	if(startDate >= endDate){
		ok = false;
		document.getElementById("unav_start_date").ariaInvalid = "true";
		document.getElementById("unav_end_date").ariaInvalid = "true";
		document.getElementById("unav_dates_error").innerHTML = "The start date must be before the end date"
		document.getElementById("unav_dates_error").style.visibility = "visible";
	}

	if(ok == false){
		return false;
	}
	ok = isNotOverlappingUnvailability(unavailability);
	if(ok == false){
		document.getElementById("unav_start_date").ariaInvalid = "true";
		document.getElementById("unav_end_date").ariaInvalid = "true";
		document.getElementById("unav_dates_error").innerHTML = "The unavailability periods cannot overlap";
		document.getElementById("unav_dates_error").style.visibility = "visible";
	}
	return ok;
}
function isNotOverlappingUnvailability(unavailability){
	const unavailabilities = getArrayFromStorage("unavailabilities");
	const start = unavailability.check_in;
	const end = unavailability.check_out;
	for(let i=0; i<unavailabilities.length; i++){
		if(unavailabilities[i].check_in <= start && start < unavailabilities[i].check_out){
			return false;
		} else if(unavailabilities[i].check_in < end && end <= unavailabilities[i].check_out){
			return false;
		} else if(start <= unavailabilities[i].check_in && unavailabilities[i].check_out <= end){
			return false;
		}
	}
	return true;
}

function setEndDateMin(type){
	let startId, endId;
	if(type == "av"){
		startId = "av_start_date";
		endId = "av_end_date";
	} else if(type == "un") {
		startId = "unav_start_date";
		endId = "unav_end_date";
	} else {
		console.log("Error: unknown type ", type);
		return;
	}
	
	let dayAfterStart = new Date(document.getElementById(startId).value);
	dayAfterStart.setDate(dayAfterStart.getDate() + 1);
	dayAfterStart = dayAfterStart.toISOString().slice(0, 10);
	
	document.getElementById(endId).setAttribute("min", dayAfterStart);
}

function deleteAvailability(id){
	if(id == null){
		console.log("Error: null availability id to delete: id = ", id);
		return;
	}
	
	document.getElementById(id).remove();
	
	// update availabilities in storage
	let availabilities = getArrayFromStorage("availabilities");
	availabilities = availabilities.filter(obj => { return obj.id != id });
	sessionStorage.setItem("availabilities", JSON.stringify(availabilities));
	
	const table = document.getElementById("availabilities");
	if(table.getElementsByTagName("tr").length == 1){
		appendDefaultRow(table, "default-av", 4, "No availabilities yet");
	}
}

function deleteUnavailability(id){
	if(id == null){
		console.log("Error: null unavailability id to delete: id = ", id);
		return;
	}
	
	document.getElementById(id).remove();
	
	// update unavailabilities in storage
	let unavailabilities = getArrayFromStorage("unavailabilities");
	unavailabilities = unavailabilities.filter(obj => { return obj.id != id });
	sessionStorage.setItem("unavailabilities", JSON.stringify(unavailabilities));
	
	const table = document.getElementById("unavailabilities");
	if(table.getElementsByTagName("tr").length == 1){
		appendDefaultRow(table, "default-un", 3, "No unavailabilities yet");
	}
}

function seePostRecap(){
	// periods are already saved in storage
	
	const accommodationId = getIdFromURL(); 
	if(accommodationId == null){
		window.location.href = staticUrl + 'post_recap.html';
	} else {
		// set accommodation's availabilities
		let availabilities = getArrayFromStorage("availabilities");
		// remove fake ids from new availabilities and put accommodation_id
		for(let av of availabilities){
			if(/^\d+$/.test(av.id) == false){
				delete av.id
				av.accommodation_id = accommodationId
			}
		}
		
		doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/availabilities', 'PATCH', headers, JSON.stringify(availabilities))
		.then((json) => {
			if(json.status){
				console.log(json);
				
				// show error to user
				let errorMessage = document.getElementById("error");
				errorMessage.innerHTML = "Error saving changes. Please check your accommodation's availabilities and retry.";
				errorMessage.style.visibility = "visible";
			}else {
				console.log("Added availabilities: ",json);
				
				// set accommodation's unavailabilities
				let unavailabilities = getArrayFromStorage("unavailabilities");
				// remove fake ids from new unavailabilities
				for(let unav of unavailabilities){
					if(/^\d+$/.test(unav.id) == false){
						delete unav.id
					}
				}
				
				doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/unavailabilities', 'PATCH', headers, JSON.stringify(unavailabilities))
				.then((json) => {
					if(json.status){
						console.log(json);
						
						// show error to user
						let errorMessage = document.getElementById("error");
						errorMessage.innerHTML = "Error saving changes. Please check your accommodation's unavailabilities and retry.";
						errorMessage.style.visibility = "visible";
					}else {
						console.log("Added unavailabilities: ",json);
						
						showSuccess("container","Accommodation's availabilities and unavailabilities edited successfully.");
						
						// remove info from storage
						removeAccommodationFromStorage();
					}
				})
				.catch((error) => {
					console.log(error, "Error trying to set accommodation's unavailabilities");

					// show error to user
					let errorMessage = document.getElementById("error");
					errorMessage.innerHTML = "Error saving changes. Please check your accommodation's unavailabilities and retry.";
					errorMessage.style.visibility = "visible";
				});
			}
		})
		.catch((error) => {
			console.log(error, "Error trying to save edited accommodation's availabilities");
			
			// show error to user
			let errorMessage = document.getElementById("error");
			errorMessage.innerHTML = "Error saving changes. Please check your accommodation's availabilities and retry.";
			errorMessage.style.visibility = "visible";
		});
	}
}