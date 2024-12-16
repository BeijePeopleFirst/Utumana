// depends on utils.js, html_utils.js, post.js

function loadWhenEditing(accommodationId){
	initHeader();
	
	document.getElementById("progress_bar").style.display = "none";
	document.getElementById("save_button").innerHTML = "Save changes";
	
	// fetch accommodation's address
	doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/address', 'GET', headers, null)
	.then((json) => {
		console.log(json);
		
		if(json.status != null){
			showError("container","Could not load the accommodation's address. Please retry.");
		} else {
			document.getElementById("country").value = json.country;
			document.getElementById("cap").value = json.cap;
			if(json.street)
				document.getElementById("street").value = json.street;
			if(json.street_number)
				document.getElementById("str_num").value = json.street_number;
			if(json.city)
				document.getElementById("city").value = json.city;
			if(json.province)
				document.getElementById("province").value = json.province;
			if(json.address_notes)
				document.getElementById("info").value = json.address_notes;
		}
	})
	.catch((error) => {
		console.log(error, "Error trying to load accommodation's address");
		showError("container","Could not load the accommodation's address. Please retry.");
	});
}

function postAddressOnLoad(){
	const accommodationId = getIdFromURL(); 
	if(accommodationId != null){
		loadWhenEditing(accommodationId);
	} else {
		// load address from session storage
		setElementValueFromStorage("country");
		setElementValueFromStorage("cap");
		setElementValueFromStorage("street");
		setElementValueFromStorage("str_num");
		setElementValueFromStorage("info");
		setElementValueFromStorage("province");
		setElementValueFromStorage("city");
	}
}

function resetValidity(name){
	document.getElementById(name).ariaInvalid = 'false';
	document.getElementById(name + "_error").style.visibility = "hidden";
}

// country and CAP must be non null
function addressOK(country, cap, street, str_num, info, province, city){
	let ok = true;
	
	if(country == null || isBlank(country)){
		ok = false;
		document.getElementById("country").ariaInvalid = "true";
		document.getElementById("country_error").style.visibility = "visible";
	}
	
	if(cap == null || isBlank(cap) || /^\d{5}$/.test(cap) == false){
		ok = false;
		document.getElementById("cap").ariaInvalid = "true";
		document.getElementById("cap_error").style.visibility = "visible";
	}
	
	// no other cheks for now
	
	return ok;
}

function saveAccommodationAddress(){
	const country = document.getElementById("country").value;
	const cap = document.getElementById("cap").value;
	const street = document.getElementById("street").value;
	const str_num = document.getElementById("str_num").value;
	const info = document.getElementById("info").value;
	const province = document.getElementById("province").value;
	const city = document.getElementById("city").value;
	
	resetValidity("country");
	resetValidity("cap");
	
	if(!addressOK(country, cap, street, str_num, info, province, city))
		return;
	
	sessionStorage.setItem("country", country);
	sessionStorage.setItem("cap", cap);
	sessionStorage.setItem("street", street);
	sessionStorage.setItem("str_num", str_num);
	sessionStorage.setItem("info", info);
	sessionStorage.setItem("province", province);
	sessionStorage.setItem("city", city);
	
	const accommodationId = getIdFromURL(); 
	if(accommodationId == null){
		window.location.href = staticUrl + 'post_availabilities.html';
	} else {
		let accommodation = {
			id: 		parseInt(accommodationId),
			owner_id: 	parseInt(localStorage.getItem("id")),
			country: 	country,
			cap: 		cap
		}
		// add optional fields to accommodation if not empty
		let item = sessionStorage.getItem("street");
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
		
		// save changes (no needs for approval)
		doFetch(prefixUrl + 'api/accommodation/' + accommodationId + '/address', 'PATCH', headers, JSON.stringify(accommodation))
		.then((json) => {
			if(json.status){
				console.log(json);
				// show error to user
				let errorMessage = document.getElementById("error");
				errorMessage.innerHTML = "Error saving changes. Please check your accommodation's address and retry.";
				errorMessage.style.visibility = "visible";
			}else {
				console.log("Edited address. Edited accommodation: ", json);
				
				showSuccess("container","Accommodation's address edited successfully.");
				
				// remove info from storage
				removeAccommodationFromStorage();
			}
		})
		.catch((error) => {
			console.log(error, "Error trying to save edited accommodation's address");
			
			// show error to user
			let errorMessage = document.getElementById("error");
			errorMessage.innerHTML = "Error saving changes. Please check your accommodation's address and retry.";
			errorMessage.style.visibility = "visible";
		});
	}
}